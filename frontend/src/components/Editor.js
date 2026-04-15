import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Editor() {
  const { id } = useParams();
  const [content, setContent] = useState("");

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

    alert("Document shared!");
  };

  const fetchDoc= async()=>{
    try {
      const response= await fetch(`http://localhost:5000/api/docs/${id}`, {
        method: 'GET',
        headers: {
          "auth-token": localStorage.getItem("token")
        }
      });
      const data= await response.json();
      setContent(data.content);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDoc();
  }, [id]);

  // Join room
  useEffect(() => {
    socket.emit("join-doc", id);
  }, [id]);

  // Receive updates
  useEffect(() => {
    socket.on("receive-changes", (newContent) => {
      // isRemoteChange.current = true;
      console.log(1);
      setContent(newContent);
    });

    return () => socket.off("receive-changes");
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async() => {
      await fetch(`http://localhost:5000/api/docs/${id}`, { 
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({content})
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [content]);

  // Send updates
  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // if (!isRemoteChange.current) {
      socket.emit("send-changes", {
        docId: id,
        content: newContent,
      });
    // }

    // isRemoteChange.current = false;
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
        <textarea
          rows={15}
          value={content}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}