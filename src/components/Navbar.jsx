import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); 
    logOutUser();
    navigate('/');
  };

  return (
    <nav className="Navbar">
      <div>
        <NavLink to="/">Home</NavLink>
        {isLoggedIn && <NavLink to="/characters">Characters</NavLink>}
        {isLoggedIn && <NavLink to="/items">Items</NavLink>}
        {isLoggedIn && <NavLink to="/spells">Spells</NavLink>}
        {isLoggedIn && <NavLink to="/profile">Profile</NavLink>}
        {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
        {!isLoggedIn && <NavLink to="/signup">Sign Up</NavLink>}
        {isLoggedIn && (
          <NavLink to="/" onClick={handleLogout}>
            Log Out
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
