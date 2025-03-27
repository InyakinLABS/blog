import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from "../header/header";
import SignUp from '../../pages/signUp-page/signUp';
import Login from "../../pages/login-page/login-page";
import Profile from "../../pages/profile-page/profile";
import PostList from "../Post-list/Post-list";
import { checkAuth } from "../../services/authSlice";
import './app.scss';

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const renderProtected = (Component) => () => 
    isLoggedIn ? <Component /> : <Redirect to="/signIn" />;

  const renderGuest = (Component) => () => 
    isLoggedIn ? <Redirect to="/" /> : <Component />;

  return (
    <div className="app">
      <Header />
      <Switch>
        <Route path="/" exact component={PostList} />
        <Route path="/articles" exact component={PostList} />
        
        <Route path="/profile" render={renderProtected(Profile)} />
        <Route path="/signIn" render={renderGuest(Login)} />
        <Route path="/signUp" render={renderGuest(SignUp)} />
        
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;