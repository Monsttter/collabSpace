import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
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

  const handleRegister = async () => {
    try {
      const data= await registerUser(email, password);

      if(data.success){
        localStorage.setItem("token", data.token);
        navigate("/");
      }
      else{
        alert(data.error);
      }
    } catch (err) {
      alert("Error registering");
    }
  };

  return (
    <div className="auth-container text-center">
      <div className="auth-card">
        <h2>Create Account</h2>

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

        <button onClick={handleRegister}>Register</button>

        <p className="link" onClick={() => (navigate("/login"))}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}