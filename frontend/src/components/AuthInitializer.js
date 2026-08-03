import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../store/auth/authSlice";
import { getUser } from "../api/auth";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(logout());

        return;
      }

      try {
        const data = await getUser();
        
        dispatch(loginSuccess(data.data));
      } catch {
        localStorage.removeItem("token");

        dispatch(logout());
      }
    }

    init();
  }, []);

  return children;
}
