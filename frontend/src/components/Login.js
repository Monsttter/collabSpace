import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token!=="undefined") {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  const handleLogin = async () => {
    try {
      const data= await loginUser(email, password);

      if(data.success){
        localStorage.setItem("token", data.token);
        navigate("/");
      }
      else{
        alert(data.error);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="auth-container text-center">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="link" onClick={() => (navigate("/register"))}>
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}