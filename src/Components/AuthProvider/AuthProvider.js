import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../../CustomHooks/useToken";
import useLogout from "../../CustomHooks/useLogout";
import useRegister from "../../CustomHooks/useRegister";
import useSession from "../../CustomHooks/useSession";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState({});
  const token = useToken();
  const logout = useLogout();
  const register = useRegister();
  const auth = useSession();

  async function handleRegister(user, pass) {
    const tkn = await register(user, pass);
    if(tkn.open !== session.open) {
      setSession(tkn);
    }
  }

  async function handleLogin(user = "", pass = "") {
    const tkn = await token(user, pass);
    if(tkn?.open !== session?.open) {
      setSession(tkn);
    }
    if (tkn?.open === "true") {
      navigate("/dashboard", { replace: true });
    }
  }

  async function handleSession() {
    const tkn = await auth();
    if(tkn?.open !== session?.open) {
      setSession(tkn);
    }
  }

  async function handleLogout() {
    const tkn = await logout();
    if(tkn !== session) {
      setSession(tkn);
    }
    navigate("/");
  }

  const value = {
    auth: session,
    Login: handleLogin,
    Register: handleRegister,
    Logout: handleLogout,
    Session: handleSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthProvider, AuthContext };
