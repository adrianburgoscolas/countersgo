import { Outlet, Link } from "react-router-dom";
import "./layout.css"

function Layout() {
  return (
    <>
      <nav>
        <ul className="nav">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/preferences">Prefences</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
