import { Outlet, Link } from "react-router-dom";
import useAuth from "../../CustomHooks/useAuth";

function Layout() {
  const { token, Logout } = useAuth();
  return (
    <>
      {
        token.open === "true"?
        <nav className="bg-stone-400 sticky top-0 py-3 flex gap-2 justify-center font-medium">
            <Link to="/dashboard" className="bg-stone-200 rounded-xl px-2">Dashboard</Link>
            <Link to="/preferences" className="bg-stone-200 rounded-xl px-2">Prefences</Link>
            <Link to="/logout" onClick={Logout} className="bg-stone-800 text-stone-200 rounded-xl px-2">Logout</Link>
      </nav>:
      ""
      }
      <Outlet />
    </>
  )
};

export default Layout;
