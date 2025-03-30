import React from "react";
import './header.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { logout } from "../../services/authSlice";
import fallbackimage from './Rectangle.svg';
import { useHistory } from "react-router-dom";

const Header = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history=useHistory();

  const handleLogout = async() => {
    await dispatch(logout());
    history.push('/');
  };
console.log(user);
  return (
    <header className="header">
      <Link to="/" className="logo">Blog Platform</Link>
      <div className="buttons">
        {!isLoggedIn ? (
          <>
            <Link to='/sign-in' className="signIn">Log In</Link>
            <Link to='/sign-up' className="signUp">Sign Up</Link>
          </>
        ) : (
          <>
          <Link to='/new-articles'>
          <button className="create">Create article</button>
          </Link>
            
            <Link to="/profile">
              <button className="profile">
                <span className="profile-name">{user?.username || 'User'}</span>
                <img 
                  className="profile-image" 
                  src={user?.image || fallbackimage} 
                  alt="Profile" 
                />
              </button>
            </Link>
            <button className="signUp logOut" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;