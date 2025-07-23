import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { useState } from "react";
import BoardCreateModal from "../BoardCreateModal";
import "./Navigation.css";


function Navigation() {

  const [showModal, setShowModal] = useState(false);
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
        <NavLink to="/favorites" className="heart-btn">
          <span className="heart">♥️</span>
        </NavLink>
        <NavLink to="/pins" className="nav-btn">
          Pins
        </NavLink>
        <NavLink to="/boards" className="nav-btn">
          Boards
        </NavLink>

        {/* Show only if logged in */}
        {user && (
          <>
            <NavLink to="/pins/new" className="nav-btn">
              Add New Pin
            </NavLink>
            <button
              className="nav-btn"
              onClick={() => setShowModal(true)}
            >
              Add New Board
            </button>
          </>
        )}
      </div>

      {/* Right: Profile/Login */}
      <div className="nav-profile">
        <ProfileButton />
      </div>
      {showModal && (
        <BoardCreateModal onClose={() => setShowModal(false)} />
      )}
    </nav>
  );
}

export default Navigation;