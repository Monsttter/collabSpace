import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import TextAlign from "@tiptap/extension-text-align";
import {CommentHighlight} from "../extensions/CommentHighlight";
import { RemoteCursor } from "../extensions/RemoteCursor";
import { useCollaborationContext } from "../context/CollaborationContext";
import { ySyncPluginKey } from "@tiptap/y-tiptap";
import { setSelectedRange } from "../../../store/comments/commentsSlice";

import * as Y from "yjs";
import { useDispatch, useSelector } from "react-redux";
import { selectComments } from "../../../store/comments/commentsSelectors";
import { resolveCommentPositions } from "../../../utils/commentPositions";

export default function useCollaborativeEditor() {

    const comments= useSelector(selectComments);

    const dispatch= useDispatch();

    const {
    
            provider,
    
            ydoc
    
        } = useCollaborationContext();

    const editor = useEditor(
        provider
            ? {
                  immediatelyRender: false,

                  extensions: [
                      StarterKit.configure({
                          history: false,
                      }),

                      Collaboration.configure({
                          document: ydoc,
                      }),

                      RemoteCursor.configure({
                          provider,
                      }),

                      CommentHighlight,

                      TextAlign.configure({
                          types: [
                              "heading",
                              "paragraph",
                          ],
                      }),
                  ],

                  editorProps: {
                      attributes: {
                          class: "tiptap-editor",
                      },
                  },
              }
            : null,
        [provider]
    );

    useEffect(() => {

    if (!editor || !provider) return;

    const updateCursor = () => {
        // console.log("Cursor update");

        const { from, to } =
            editor.state.selection;

        provider.awareness.setLocalStateField(
            "cursor",
            {
                anchor: from,
                head: to,
            }
        );
    };

    const handleSelectionUpdate = () => {

    const {
        from,
        to,
    } = editor.state.selection;


    provider.awareness.setLocalStateField(
        "cursor",
        {
            anchor: from,
            head: to,
        }
    );


    if (from === to) {

        return;

    }


    const text =
        editor.state.doc.textBetween(
            from,
            to,
            " "
        );


    if (!text.trim()) {

        return;

    }


    dispatch(
        setSelectedRange({

            anchor: from,

            head: to,

            text,

        })
    );

};

    editor.on(
        "selectionUpdate",
        handleSelectionUpdate
    );

    editor.on(
        "transaction",
        updateCursor
    );

    updateCursor();

    return () => {

        editor.off(
            "selectionUpdate",
            handleSelectionUpdate
        );

        editor.off(
            "transaction",
            updateCursor
        );

    };

}, [editor, provider]);

    return editor;
}