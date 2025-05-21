import { NavLink } from "react-router-dom";

function Navbar() {


  return (
    <nav className={"Navbar"}>
      <div>
        <NavLink to="/"> Home </NavLink>
        <NavLink to="/characters"> Characters </NavLink>
        <NavLink to="/items"> Items </NavLink>
        <NavLink to="/profile"> Profile </NavLink>
        <NavLink to="/login"> Login </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;