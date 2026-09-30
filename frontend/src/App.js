import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import DocumentInitializer from "./components/DocumentInitializer.js";
import Dashboard from "./pages/Dashboard.js";
import Editor from "./pages/Editor.js";
import Documents from "./pages/Documents.js";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout.js";
import EditorLayout from "./layouts/EditorLayout/EditorLayout.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute> <Documents /> </ProtectedRoute>} />
          </Route>
          <Route element={<EditorLayout />}>
            <Route path="/editor/:id" element={<ProtectedRoute> <DocumentInitializer> <Editor /> </DocumentInitializer></ProtectedRoute>} />
          </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
