import React, { useEffect } from "react";
import './header.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { logout } from "../../services/authSlice";
import fallbackimage from './Rectangle.svg';
import { store } from "../../services/store";

const Header = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
useEffect(()=>{
    console.log(store.getState())
},[])
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Blog Platform</Link>
      <div className="buttons">
        {!isLoggedIn ? (
          <>
            <Link to='/signIn' className="signIn">Sign In</Link>
            <Link to='/signUp' className="signUp">Sign Up</Link>
          </>
        ) : (
          <>
            <button className="create">Create article</button>
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