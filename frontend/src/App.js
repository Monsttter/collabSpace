import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.js";
import Editor from "./components/Editor.js";
import "./App.css";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/doc/:id" element={<ProtectedRoute> <Editor /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
