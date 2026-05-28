import { useParams } from "react-router-dom";
import { useState } from "react";
import CollaborativeEditor from "./CollaborativeEditor";
import { shareDocument } from "../api/documents";

export default function Editor() {
  const { id } = useParams();

  const [email, setEmail] = useState("");

  const shareDoc = async () => {

    await shareDocument(id, email);
    setEmail("");

    alert("Document shared!");
  };

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
        <CollaborativeEditor docId={id} />
      </div>
    </div>
  );
}