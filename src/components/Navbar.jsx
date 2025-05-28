import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import '../Navbar.css';

function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logOutUser();
    navigate('/');
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-container">
        {/* LEFT side - only show on large screens */}
        <div className="Navbar-left desktop-only">
          <NavLink to="/">Home</NavLink>
          {isLoggedIn && <NavLink to="/characters">Characters</NavLink>}
          {isLoggedIn && <NavLink to="/items">Items</NavLink>}
          {isLoggedIn && <NavLink to="/spells">Spells</NavLink>}
        </div>

        {/* RIGHT side - auth buttons, always visible */}
        <div className="Navbar-right">
          {isLoggedIn && <NavLink to="/profile">Profile</NavLink>}
          {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
          {!isLoggedIn && <NavLink to="/signup">Sign Up</NavLink>}
          {isLoggedIn && (
            <NavLink to="/" onClick={handleLogout}>
              Log Out
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
