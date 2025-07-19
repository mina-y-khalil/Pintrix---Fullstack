import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink to="/favorites">❤️ Favorites</NavLink>
          </li>
          <li>
            <ProfileButton />
          </li>
        </>
      )}
    </ul>
  );
}

export default Navigation;
