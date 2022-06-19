import { Outlet, Link } from "react-router-dom";
import useAuth from "../../CustomHooks/useAuth";

function Layout() {
  const { token, Logout } = useAuth();
  return (
    <>
      {
        token.open === "true"?
        <nav className="bg-stone-400 sticky top-0 py-3 flex justify-center font-medium">
            <Link to="/dashboard" className="mx-1 bg-stone-200 hover:bg-stone-300 transition-all rounded-xl px-2">Dashboard</Link>
            <Link to="/preferences" className="mx-1 bg-stone-200 hover:bg-stone-300 transition-all rounded-xl px-2">Prefences</Link>
            <Link to="/logout" onClick={Logout} className="mx-1 bg-stone-800 hover:bg-stone-600 text-stone-200 rounded-xl px-2">Logout</Link>
      </nav>:
      ""
      }
      <Outlet />
    </>
  )
};

export default Layout;
