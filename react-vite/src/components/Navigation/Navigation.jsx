// Navigation.jsx
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

import "./Navigation.css";

function Navigation() {
  
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="nav-bar">
      {/* Left: Logo */}
      <div className="nav-left">
        <NavLink to="/">
          <img
            src="https://redeem-innovations.com/wp-content/uploads/2025/07/Pintrix-Logo.png"
            alt="Pintrix Logo"
            className="nav-logo"
          />
        </NavLink>
      </div>

      {/* Center: Nav Links */}
      <div className="nav-links">
        {user && (
          <>
        
        <NavLink to="/favorites" className="heart-btn">
          <span className="heart">♥️</span>
        </NavLink>
        <NavLink to="/pins" className="nav-btn">
          Pins
        </NavLink>
        <NavLink to="/boards" className="nav-btn">
          Boards
        </NavLink>
        <NavLink to="/pins/new" className="nav-btn">
              Add New Pin
        </NavLink>
        <NavLink to="/boards/create" className="nav-btn">
              Add New Board
        </NavLink>
        </>
        )}
        </div>


      {/* Right: Profile/Login */}
      <div className="nav-profile">
        <ProfileButton />
      </div>


    </nav>
  );
}

export default Navigation;
