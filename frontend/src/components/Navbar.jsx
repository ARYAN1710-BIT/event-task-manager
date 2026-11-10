
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.error("Unable to load user profile");
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUsername(response.data.username);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  fetchUser();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="brand-icon">✦</span> EventFlow
      </Link>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={getLinkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/events" className={getLinkClass}>
          Events
        </NavLink>

        <NavLink to="/tasks" className={getLinkClass}>
          Tasks
        </NavLink>
      </div>

      <div className="navbar-user">
        

        
        <Link to="/profile" className="navbar-user">
  <div className="user-avatar">
    {username?.charAt(0).toUpperCase() || "U"}
  </div>

  <span>{username}</span>
</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
