import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";


function Navigation() {
  return (
    <nav className="nav-bar">
      {/* Left: Logo */}
      <div className="nav-left">
        <NavLink to="/">
          <img 
            src="https://lodgr.s3.us-east-2.amazonaws.com/Navbar+Logo.jpg" 
            alt="Pintrix Logo" 
            className="nav-logo" 
          />
        </NavLink>
      </div>

      {/* Center: Nav Links */}
      <div className="nav-links">
        <NavLink to="/favorites" className="heart-btn">
          <span className="heart">♥</span>
        </NavLink>
        <NavLink to="/boards" className="nav-btn">
          Boards
        </NavLink>
        <NavLink to="/pins/new" className="nav-btn">
          Add New Pin
        </NavLink>
        <NavLink to="/pins/manage" className="nav-btn">
          Manage Pins
        </NavLink>
      </div>

      {/* Right: Profile/Login */}
      <div className="nav-profile">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;