// import { Box, Button, Divider, Drawer, IconButton, Paper, Stack, Typography } from "@mui/material";

// import QuickActions from "./QuickActions";
// import PromptInput from "./PromptInput";
// import AIResponse from "./AIResponse";
import { selectSelectedRange } from "../../../../store/comments/commentsSelectors";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateAI } from "../../../../api/ai";
// import { AutoAwesomeOutlined } from "@mui/icons-material";
// import CloseIcon from "@mui/icons-material/Close";
import { clearSelectedRange } from "../../../../store/comments/commentsSlice";
import AIDrawer from "./AIDrawer";
import { clearPendingSelection, closeDrawer } from "../../../../store/ui/uiSlice";

export default function AIPanel({editor}) {
  // const [aiOpen, setAiOpen] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("");

  // const [aiAction, setAiAction] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const [aiResponse, setAiResponse] = useState("");

  const [aiError, setAiError] = useState("");

  const [aiRequestContext, setAiRequestContext] = useState(null);

  const [aiResultType, setAiResultType] = useState(null); // "edit" | "answer"

  const selectedRange = useSelector(selectSelectedRange);

  const selectedText= selectedRange?.text;

  const hasSelection =
    Boolean(selectedText?.trim());

  const currentDocument = useSelector((state) => state.documents.currentDocument);

  const [aiMode, setAiMode] = useState("document");
// "document" | "selection" | "cursor"

    const aiInsertPositionRef = useRef(null);
    const aiReplaceRangeRef = useRef(null);

  const dispatch= useDispatch();

  const handleClose= ()=>{
        dispatch(closeDrawer());
        dispatch(clearPendingSelection());
    }

  const handleQuickAction = (action) => {

    if(hasSelection){
      setAiMode("selection");
    }
    else{
      setAiMode("document");
    }

    setAiPrompt(action.prompt);

    clearAIResponse();

    setAiError("");
};

  const submitPrompt  = async () => {
    const prompt =
        aiPrompt.trim();

    if (!prompt || aiLoading || !editor) {
        return;
    }

    try {

      setAiLoading(true);

      setAiError("");

      setAiResponse("");

      /*
         * Get the latest document content
         * directly from the collaborative editor.
         */
        const documentContent =
            editor.getText();

        let requestContext;

    if (aiMode === "cursor") {
      requestContext = getContinueWritingContext();

      if (!requestContext) {
        setAiError(
          "Place the cursor where you want to continue writing."
        );
        return;
      }
      aiInsertPositionRef.current = requestContext.position;
    } else {
      const hasSelection = Boolean(selectedText?.trim());

      if(hasSelection){
         aiReplaceRangeRef.current = {
          from: selectedRange.anchor,
          to: selectedRange.head,
        };
      }

      requestContext = {
        type: hasSelection ? "selection" : "document",
        selectedText: hasSelection ? selectedText : null,
      };
    }

      const result =
            await generateAI({

                prompt,

                context: requestContext,

                documentContent

            });

      setAiRequestContext({
        prompt,
        context: requestContext,
        documentContent,
      });
    //   console.log(result);
      setAiResponse(
            result.data.response
        );

        setAiResultType(
            result.data.type
        );
      
    } catch (error) {
      console.error("AI error:", error);

      setAiError(error.message || "Unable to generate AI response.");
    } finally {
      setAiLoading(false);
    }
  };
  const handleRegenerate  = async () => {
    const prompt =
        aiPrompt.trim();

    if (!prompt || aiLoading || !editor) {
        return;
    }

    try {

      setAiLoading(true);

      setAiError("");

      setAiResponse("");

      const result =
            await generateAI(aiRequestContext);

    //   console.log(result);
      setAiResponse(
            result.data.response
        );

        setAiResultType(
            result.data.type
        );
      
    } catch (error) {
      console.error("AI error:", error);

      setAiError(error.message || "Unable to generate AI response.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptReplace = () => {

    if (
        !editor ||
        !aiResponse ||
        !selectedRange ||
        currentDocument.role === "viewer"
    ) {
        return;
    }

  const range = aiReplaceRangeRef.current;

  if (!range) {
    setAiError("The original selection is no longer available.");
    return;
  }

  const docSize = editor.state.doc.content.size;
  
  const from = Math.max(0, Math.min(range.from, docSize));
  const to = Math.max(from, Math.min(range.to, docSize));
  
  const currentText =
  editor.state.doc.textBetween(
            from,
            to,
            " "
        );

    if (currentText !== selectedText) {
      setAiResultType(null);
      setAiError("The selected text has changed since this AI response was generated.")
      return;
    }
    
    try {

    editor
  .chain()
  .focus()
  .deleteRange({ from, to })
  .insertContentAt(from, aiResponse)
  .run();


    // setAiResult("");

    // setAiSelection(null);
    dispatch(clearSelectedRange());
    clearAIResponse();
    setAiPrompt("");

    aiReplaceRangeRef.current = null;

  } catch (error) {
    console.error("Failed to replace selected text:", error);
    setAiError("Unable to replace the selected text.");
  }

};


const handleAcceptInsert = () => {
  if (!editor || !aiResponse) return;

  const position = aiInsertPositionRef.current;

  if (position === null) {
    setAiError("The original cursor position is no longer available.");
    return;
  }

  try {
    const safePosition = Math.min(
      position,
      editor.state.doc.content.size
    );

    editor
      .chain()
      .focus()
      .insertContentAt(safePosition, aiResponse)
      .run();

    // Clear the completed AI operation
    clearAIResponse();

    aiInsertPositionRef.current = null;

  } catch (error) {
    console.error("Failed to insert AI content:", error);
    setAiError("Unable to insert the generated content.");
  }
};


const clearAIResponse = useCallback(() => {
    
    setAiResponse("");

    setAiResultType(null);

    setAiError("");

    setAiRequestContext(null);
    
}, []);

    useEffect(()=>{
        clearAIResponse();
        // eslint-disable-next-line
    }, [selectedRange]);


    const getContinueWritingContext = () => {
  if (!editor) return null;

  const { from, empty } = editor.state.selection;

  // Continue Writing should work only with a cursor,
  // not an active text selection.
  if (!empty) return null;

  const before = editor.state.doc
    .textBetween(0, from, "\n")
    .slice(-3000);

  const after = editor.state.doc
    .textBetween(from, editor.state.doc.content.size, "\n")
    .slice(0, 1500);

  return {
    type: "cursor",
    position: from,
    before,
    after,
  };
};

const handleContinueWriting = () => {
  if (!editor) return;

  const context = getContinueWritingContext();

  if (!context) {
    setAiError("Place the cursor where you want to continue writing.");
    return;
  }

  setAiMode("cursor");

  setAiPrompt("Continue writing from here.");

  // Clear previous AI result
  setAiResponse("");
  setAiResultType(null);
  setAiError("");
};


    useEffect(() => {
  if (!editor) return;

  const handleTransaction = ({ transaction }) => {
    const currentPosition = aiInsertPositionRef.current;

    if (currentPosition === null) return;

    if (!transaction.docChanged) return;

    aiInsertPositionRef.current =
      transaction.mapping.map(currentPosition);
  };

  editor.on("transaction", handleTransaction);

  return () => {
    editor.off("transaction", handleTransaction);
  };
}, [editor]);

useEffect(() => {
  if (!editor) return;

  const handleTransaction = ({ transaction }) => {
    if (!transaction.docChanged) return;

    // Continue Writing
    if (aiInsertPositionRef.current !== null) {
      aiInsertPositionRef.current =
        transaction.mapping.map(aiInsertPositionRef.current);
    }

    // Selected-text replacement
    if (aiReplaceRangeRef.current) {
      aiReplaceRangeRef.current = {
        from: transaction.mapping.map(
          aiReplaceRangeRef.current.from
        ),
        to: transaction.mapping.map(
          aiReplaceRangeRef.current.to
        ),
      };
    }
  };

  editor.on("transaction", handleTransaction);

  return () => {
    editor.off("transaction", handleTransaction);
  };
}, [editor]);

  return (

    <AIDrawer
    // open={aiOpen}
    
    onClose={handleClose}

    selectedText={selectedText}

    prompt={aiPrompt}

    setPrompt={setAiPrompt}

    response={aiResponse}

    loading={aiLoading}

    error={aiError}

    resultType={aiResultType}

    selection={selectedRange}

    clearAIResponse={clearAIResponse}

    onQuickAction={
        handleQuickAction
    }

    onSubmit={
        submitPrompt
    }

    onNew={() => {

        setAiPrompt("");

        setAiResponse("");

        setAiError("");

        setAiResultType(null);

        setAiLoading(false);

        setAiRequestContext(null);

        aiInsertPositionRef.current = null;
        aiReplaceRangeRef.current = null;

        dispatch(clearSelectedRange());
    }}

    onClearSelection={() => {

        dispatch(clearSelectedRange());

        clearAIResponse();

    }}

    onAccept={
        handleAcceptReplace
    }

    onRegenerate={
        handleRegenerate
    }

    handleContinueWriting= {handleContinueWriting}

    handleAcceptInsert= {handleAcceptInsert}
/>
  );
}
