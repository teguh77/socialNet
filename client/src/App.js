//import useEffect karena function base component sehingga tidak bisa menggunakan lifeCycleMethode
import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './routing/PrivateRoute';
import './App.css';

//Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

//Redux
import {Provider} from 'react-redux';
import {loadUser} from './actions/auth';
import setAuthToken from './reducers/utils/setAuthToken';
import store from './store';

//Digunakan untuk mengecek apakah ada token di local storage
//alasan dijalankan di app.js adalah agar setiap kali app dijalankan maka fungsi ini juga akan dilakukan lagi
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //menggunakan hooks useEffect untuk menggantikan componentDidMount pada classBaseComponent
  //menaruh [] kosong sebagai argumen kedua agar useEffect hanya dieksekusi sekali pada saat app dijalankan, dan memberitahu react  bahwa useEffect tidak tergantung state atau props apapun, jadi mirip componentDidMount;
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:id' component={Profile} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
              <PrivateRoute exact path='/posts' component={Posts} />
              <PrivateRoute exact path='/posts/:id' component={Post} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
