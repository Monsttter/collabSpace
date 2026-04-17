import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function Editor() {
  const { id } = useParams();
  const editorRef = useRef(null);

  const [email, setEmail] = useState("");

  const shareDoc = async () => {

    await fetch("http://localhost:5000/api/docs/share", {
      method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({ document_id: id, email})
      }
    );
    setEmail("");

    alert("Document shared!");
  };

  useEffect(() => {
    // Create Yjs doc
    const ydoc = new Y.Doc();

    // Connect to WebSocket server
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      id, // room id (use docId later)
      ydoc
    );

    const yText = ydoc.getText("quill");

    // Bind to textarea
    const textarea = editorRef.current;

    // Update UI when remote changes come
    yText.observe(() => {
      textarea.value = yText.toString();
    });

    // Update CRDT when user types
    textarea.addEventListener("input", () => {
      ydoc.transact(() => {
        yText.delete(0, yText.length);
        yText.insert(0, textarea.value);
      });
    });

    let initialized = false;

    provider.on("sync", async(isSynced) => {
      if (!isSynced || initialized) return;

      if (yText.length === 0) {
        const response= await fetch(`http://localhost:5000/api/docs/${id}`, {
          method: 'GET',
          headers: {
            "auth-token": localStorage.getItem("token")
          }
        });
        const data= await response.json();
        ydoc.transact(() => {
            yText.insert(0, data.content || "");
        })
      }

      initialized = true;
    });

    const interval = setInterval(async() => {
      const content = yText.toString();

      await fetch(`http://localhost:5000/api/docs/${id}`, { 
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({content})
      });
    }, 2000); // every 2 sec


    return () => {
      clearInterval(interval);
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  return (
    <div className="container text-center" >
      <div className="card">
        <h3>Share Document</h3>

        <input
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={shareDoc}>Share</button>
      </div>

      <div className="card">
        <h2>Editor</h2>
        <textarea ref={editorRef} rows={15} />
      </div>
    </div>
  );
}