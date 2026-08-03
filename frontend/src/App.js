import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home.js";
// import Editor from "./components/Editor.js";
import "./App.css";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import DocumentInitializer from "./components/DocumentInitializer.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
// import Editor from "./pages/Editor/EditorPage.js";
import EditorPage from "./pages/Editor/EditorPage.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} /> */}
        <Route path="/" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        {/* <Route path="/" element={<ProtectedRoute> <Editor /> </ProtectedRoute>} /> */}
        <Route path="/editor/:id" element={<ProtectedRoute> <DocumentInitializer> <EditorPage /> </DocumentInitializer></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
