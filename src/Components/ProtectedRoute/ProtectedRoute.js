import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../CustomHooks/useAuth";

function ProtectedRoute({ children }) {
  const { token, Session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    Session();
    //eslint-disable-next-line
  }, []);

  if (token.open === "false") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
