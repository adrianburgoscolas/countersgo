import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../../CustomHooks/useToken";
import useLogout from "../../CustomHooks/useLogout";
import useRegister from "../../CustomHooks/useRegister";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState({ open: "false" });
  const token = useToken();
  const logout = useLogout();
  const register = useRegister();

  async function handleRegister(user, pass) {
    const tkn = await register(user, pass);
    setSession(tkn);
  }

  async function handleLogin(user = "", pass = "") {
    const tkn = await token(user, pass);
    setSession(tkn);
    if (tkn.open === "true") {
      navigate("/dashboard", { replace: true });
    }
  }

  async function handleSession() {
    const tkn = await token();
    setSession(tkn);
  }

  async function handleLogout() {
    const tkn = await logout();
    setSession(tkn);
    navigate("/");
  }

  const value = {
    token: session,
    Login: handleLogin,
    Register: handleRegister,
    Logout: handleLogout,
    Session: handleSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthProvider, AuthContext };
