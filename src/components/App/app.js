import React, { useEffect } from "react";
import { Switch, Route, Redirect} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from "../header/header";
import SignUp from '../../pages/signUp-page/signUp';
import Login from "../../pages/login-page/login-page";
import Profile from "../../pages/profile-page/profile";
import PostList from "../Post-list/Post-list";
import { checkAuth } from "../../services/authSlice";
import './app.scss';
import { store } from "../../services/store";
import NewPost from "../../pages/createPost-page/create-post";
import PostPage from "../../pages/post-page/post-page";
import EditPost from "../../pages/edit-post/edit-post";

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(checkAuth());
    console.log(store.getState());
  }, [dispatch]);

  const renderProtected = (Component) => () => 
    isLoggedIn ? <Component /> : <Redirect to="/sign-in" />;

  const renderGuest = (Component) => () => 
    isLoggedIn ? <Redirect to="/" /> : <Component />;

  return (
    <div>
      <Header />
      <Switch>
        <Route path="/" exact component={PostList}/>
        <Route path="/articles" exact component={PostList} />
        <Route path="/articles/:slug"  exact component={PostPage} />
        <Route path="/articles/:slug/edit" exact  render={renderProtected(EditPost)} />
        <Route path="/new-article" exact render={renderProtected(NewPost)}/> 
        <Route path="/profile" render={renderProtected(Profile)} />
        <Route path="/sign-in" render={renderGuest(Login)} />
        <Route path="/sign-up" render={renderGuest(SignUp)} />
        
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;