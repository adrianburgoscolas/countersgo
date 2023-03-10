import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../CustomHooks/useAuth";

function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth.open === "false") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
