import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../components/styles/Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUsername(parsedUser.name || "User");
        setRole(parsedUser.role || "");
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setRole("");
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    navigate("/");
  };

  const renderRoleBasedLinks = () => {
    switch (role) {
      case "artist":
        return (
          <>
            <li>
              <Link
                to="/upload"
                className={location.pathname === "/upload" ? "active" : ""}
                aria-current={location.pathname === "/upload" ? "page" : undefined}
              >
                Upload Artwork
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={location.pathname === "/gallery" ? "active" : ""}
                aria-current={location.pathname === "/gallery" ? "page" : undefined}
              >
                Gallery
              </Link>
            </li>
          </>
        );
      case "buyer":
        return (
          <li>
            <Link
              to="/gallery"
              className={location.pathname === "/gallery" ? "active" : ""}
              aria-current={location.pathname === "/gallery" ? "page" : undefined}
            >
              Gallery
            </Link>
            

          </li>
        );
      case "moderator":
        return (
          <li>
            <Link
              to="/moderator"
              className={location.pathname === "/moderator" ? "active" : ""}
              aria-current={location.pathname === "/moderator" ? "page" : undefined}
            >
              Moderator Panel
            </Link>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""} aria-current={location.pathname === "/" ? "page" : undefined}>
            Home
          </Link>
        </li>
        {renderRoleBasedLinks()}
        {!isLoggedIn ? (
          <>
            <li>
              <Link
                to="/signup"
                className={location.pathname === "/signup" ? "active" : ""}
                aria-current={location.pathname === "/signup" ? "page" : undefined}
              >
                Sign up
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
                aria-current={location.pathname === "/login" ? "page" : undefined}
              >
                Login
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className="logout-btn"
              aria-label="Logout"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
