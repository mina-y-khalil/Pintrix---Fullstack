import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../redux/session';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css';

function ProfileButton() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    closeMenu();
    navigate('/');
  };

  const ulClassName = `profile-dropdown${showMenu ? '' : ' hidden'}`;

  return (
    <div className='profile-button-wrapper'>
      <button onClick={toggleMenu} className='profile-menu-button'>
        <FaBars className='menu-icon' />
        <FaUserCircle className='user-icon' />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className='dropdown-user-info'>
              <div>Hello, {user.firstName || user.username}</div>
              <div>{user.email}</div>
            </li>
            <hr />
            <li className='dropdown-logout'>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li className='dropdown-login-signup'>
              <button
        onClick={() => {
          closeMenu();
          navigate('/login'); 
        }}
      >
        Log In
      </button>
            </li>
            <li className='dropdown-login-signup'>
            <button
        onClick={() => {
          closeMenu();
          navigate('/signup');  
        }}
      >
        Sign Up
      </button>
            </li>
          </>
        )}
        </ul>
    </div>
  );
}

export default ProfileButton;