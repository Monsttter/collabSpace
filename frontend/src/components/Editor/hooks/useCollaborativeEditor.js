import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import TextAlign from "@tiptap/extension-text-align";
import {CommentHighlight} from "../extensions/CommentHighlight";
import { RemoteCursor } from "../extensions/RemoteCursor";
import { useCollaborationContext } from "../context/CollaborationContext";
import { setSelectedRange } from "../../../store/comments/commentsSlice";

import { useDispatch, useSelector } from "react-redux";
// import { selectComments } from "../../../store/comments/commentsSelectors";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function useCollaborativeEditor() {

    const user= useSelector(state => state.auth.user);
    
    const collaborators = useSelector(
        state => state.collaborators.collaborators
    );

    const currentUser = collaborators.find(
        collaborator =>
            String(collaborator.id) ===
            String(user?.id)
    );

    const role = currentUser?.role;

    const dispatch= useDispatch();

    const {
    
            provider,
    
            ydoc
    
        } = useCollaborationContext();

    const editor = useEditor(
        provider
            ? {
                  immediatelyRender: false,

                  editable: role !== "viewer",

                  extensions: [
                      StarterKit.configure({
                          history: false,
                          undoRedo: false,
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

                      Link.configure({
                            // openOnClick: false,
                            autolink: true,
                            linkOnPaste: true,
                        }),

                        Image.configure({
                            inline: false,
                            allowBase64: false,
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
        if (!editor) return;

        editor.setEditable(role !== "viewer");
    }, [editor, role]);

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
    // eslint-disable-next-line
}, [editor, provider]);

    return editor;
}