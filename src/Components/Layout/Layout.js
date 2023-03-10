import { Outlet, Link } from "react-router-dom";
import useAuth from "../../CustomHooks/useAuth";

function Layout() {
  const { auth, Session, Logout } = useAuth();
  const userLang = navigator.language || navigator.userLanguage;

  Session();

  return (
    <>
      {auth?.open === "true" ? (
        <nav className="bg-stone-400 sticky top-0 py-3 flex justify-center font-medium">
          <Link
            to="/dashboard"
            className="mx-1 bg-stone-200 hover:bg-stone-300 transition-all rounded-xl px-2"
          >
            {userLang === "es-ES" ? "Panel" : "Dashboard"}
          </Link>
          <Link
            to="/preferences"
            className="mx-1 bg-stone-200 hover:bg-stone-300 transition-all rounded-xl px-2"
          >
            {userLang === "es-ES" ? "Preferencias" : "Prefences"}
          </Link>
          <Link
            to="/logout"
            onClick={Logout}
            className="mx-1 bg-stone-800 hover:bg-stone-600 text-stone-200 rounded-xl px-2"
          >
            {userLang === "es-ES" ? "Cerrar sesion" : "Logout"}
          </Link>
        </nav>
      ) : (
        ""
      )}
      <Outlet />
    </>
  );
}

export default Layout;
