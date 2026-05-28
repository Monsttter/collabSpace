import Collaboration from "@tiptap/extension-collaboration";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import { updateDocument } from "../api/documents";

function CollaborativeEditorInner({ docId, ydoc, provider, initialContent }) {
    const [users, setUsers] = useState([]);
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ history: false }),
            Collaboration.configure({
                document: ydoc,
            })
        ],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "tiptap-editor",
            },
        }
    });
    
    useEffect(()=>{
        if (!provider || !editor) return;
        
        editor.commands.setContent(initialContent);
          
        const interval = setInterval(async() => {
            const html = editor.getHTML();
            await updateDocument(docId, html);
        }, 2000); // every 2 sec

        const awareness = provider.awareness;

        awareness.setLocalState({
            user: {
                name: "Rahul_" + Math.floor(Math.random() * 1000),
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            },
            cursor: null,
        });

        const updateUsers = () => {
            const states = Array.from(awareness.getStates().values());

            const users = states.map((state) => ({
            name: state.user?.name || "Anonymous",
            color: state.user?.color || "gray",
            position:
                state.cursor?.from !== undefined
                ? state.cursor.from
                : "N/A",
            }));

            setUsers(users);
        };
    
        awareness.on("change", updateUsers);

        const updateCursor = () => {
            const { from, to } = editor.state.selection;
            
            awareness.setLocalStateField("cursor", {
                from,
                to,
            });
        };

        editor.on("selectionUpdate", updateCursor);

        return () => {
            clearInterval(interval);
            awareness.off("change", updateUsers);
            editor.off("selectionUpdate", updateCursor);
        };

    }, [editor, provider, docId, initialContent])


    return (
        <div className="editor-wrapper">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
            <div style={{ marginTop: "20px" }}>
            <h3>Active Users</h3>

            {users.map((u, i) => (
                <div key={i} style={{ color: u.color }}>
                {u.name} — Cursor at: {u.position ?? "N/A"}
                </div>
            ))}
            </div>
        </div>
    );
}

export default CollaborativeEditorInner;