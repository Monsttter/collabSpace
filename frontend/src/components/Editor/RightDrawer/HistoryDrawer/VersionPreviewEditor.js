import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { Editor } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { useSelector } from "react-redux";

function VersionPreviewEditor({
  extensions = [],
}) {

    const { selectedVersion } = useSelector(state => state.versions);
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!selectedVersion || !containerRef.current) {
      return;
    }

    /*
     * IMPORTANT:
     * This is NOT the live collaborative Y.Doc.
     */
    const previewDoc = new Y.Doc();

    /*
     * Convert the API snapshot back into Uint8Array.
     *
     * Adjust this depending on how your existing API
     * serializes BYTEA.
     */
    // const update = new Uint8Array(
    //   Object.values(selectedVersion.snapshot)
    // );
    const update = new Uint8Array(selectedVersion.snapshot.data);

    Y.applyUpdate(
      previewDoc,
      update
    );

    const editor = new Editor({
      element: containerRef.current,

      extensions: [
        StarterKit.configure({
          history: false,
        }),

        Collaboration.configure({
          document: previewDoc,
        }),

        ...extensions,
      ],

      editable: false,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      previewDoc.destroy();

      editorRef.current = null;
    };
  }, [selectedVersion, extensions]);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "400px",
        padding: "20px",
      }}
    />
  );
}

export default VersionPreviewEditor;