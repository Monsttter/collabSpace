import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

//   const authenticated =
//         useSelector(
//             state =>
//                 state.auth.isAuthenticated
//         );

//     return authenticated
//         ? children
//         : <Navigate to="/login" replace />;

  if (!token || (token==="undefined")) {
    return <Navigate to="/login" replace />;
  }

  return children;
}