import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './types';
import {setAlert} from './alert';
import setAuthToken from '../reducers/utils/setAuthToken';

//LOAD USER
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data.user
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

//REGISTER USER
export const register = ({name, email, password}) => async dispatch => {
  //define headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //stringify body
  const body = JSON.stringify({name, email, password});

  //post request
  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    //grab errors from express-validation errrors in backend
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

//LOGIN USER
export const login = (email, password) => async dispatch => {
  //define headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //stringify body
  const body = JSON.stringify({email, password});

  //post request
  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser()); //to load user
  } catch (err) {
    //grab errors from express-validation errrors in backend
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

//LOGOUT USER
export const logout = () => dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });
  dispatch({
    type: LOGOUT
  });
};
