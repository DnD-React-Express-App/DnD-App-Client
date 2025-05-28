import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import '../NavBar.css';

function BottomNav() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) return null;

  return (
    <nav className="BottomNav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/characters">Characters</NavLink>
      <NavLink to="/items">Items</NavLink>
      <NavLink to="/spells">Spells</NavLink>
    </nav>
  );
}

export default BottomNav;