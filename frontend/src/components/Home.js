import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [title, setTitle] = useState("");
  const [docs, setDocs] = useState([]);
  const navigate= useNavigate();

  const token = localStorage.getItem("token");

  const fetchDocs= async()=>{
    const response= await fetch("http://localhost:5000/api/docs", {
      headers: { "auth-token": localStorage.getItem("token") },
    });
    const data= await response.json();
    setDocs(data);

  }

  // Fetch all documents
  useEffect(() => {
    fetchDocs();
  }, []);

  const createDoc = async () => {
    if (!title.trim()){
      alert("Title is empty");
      return;
    }

    const response = await fetch("http://localhost:5000/api/docs", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({ title, content: ""}),
    });
    const data= await response.json();
    // setDocs([...docs, data]);

    navigate(`/doc/${data.id}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Your Documents</h2>
        <button onClick={logout}>Logout</button>
      </div>


      <div className="card">
        <h2>Create Document</h2>
        <input
          placeholder="Enter document title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createDoc}>Create</button>
      </div>

      {/* Documents List */}
      <div className="card">
        <h3>All Documents</h3>

        {docs.length === 0 ? (
          <p>No documents yet</p>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/doc/${doc.id}`)}
              style={{
                padding: "12px",
                marginTop: "10px",
                background: "#334155",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#475569")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#334155")
              }
            >
              <h4 style={{ margin: 0 }}>{doc.title || "Untitled Document"}</h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
}