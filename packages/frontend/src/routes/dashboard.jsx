import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  console.log("Dashboard::user", user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <>
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <span className="navbar-brand">Trail Race App</span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to={"/"}>
                    Races
                  </Link>
                </li>
                {user.role === "administrator" && (
                  <li className="nav-item">
                    <Link className="nav-link" to={`races/create`}>
                      Create New Race
                    </Link>
                  </li>
                )}
                {user.role === "applicant" && (
                  <li className="nav-item">
                    <Link className="nav-link" to={`applications`}>
                      My Applications
                    </Link>
                  </li>
                )}
              </ul>
              <span className="navbar-text">
                {user.email} ({user.role})
              </span>
              <a className="nav-link p-2" href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </div>
        </nav>
      </div>

      <div className="my-5">
        <Outlet />
      </div>

      <div className="container">
        <hr />
        <div className="text-center">&copy; 2024. Trail Race App</div>
      </div>
    </>
  );
}
