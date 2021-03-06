import axios from 'axios';
import { fetchGoals } from './goals'
import { browserHistory } from 'react-router';
import { isBrowser } from '../utils'

/* -----------------    ACTIONS     ------------------ */

export const SET_USER    = 'SET_USER'
export const REMOVE_USER = 'REMOVE_USER'

/* ------------   ACTION CREATORS     ------------------ */

export const setUser   = user => ({ type: SET_USER, user })
export const removeUser  = () => ({ type: REMOVE_USER })

/* ------------       REDUCER     ------------------ */

const initialUser = {};
export default function reducer(currentUser = initialUser, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    case REMOVE_USER:
      return initialUser;
    default:
      return currentUser;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const login = (credentials, displayErr) => dispatch => {
  axios.post('/api/auth/login', credentials)
    .then(res => {
      dispatch(setUser(res.data));
      if (isBrowser()) {
        dispatch(fetchGoals());
        browserHistory.push('/');
      }
    })
    .catch(err => {
      console.error('Unable to log in', err)
      displayErr('Invalid credentials');
    });
}

export const signup = (credentials, displayErr) => dispatch => {
  axios.post('/api/auth/signup', credentials)
    .then(res => {
      dispatch(setUser(res.data));
      if (isBrowser()) {
        dispatch(fetchGoals());
        browserHistory.push('/');
      }
    })
    .catch(err => {
      console.error('Unable to sign up', err)
      displayErr('Issue with sign up');
    });
}

export const retrieveLoggedInUser = () => dispatch => {
  axios.get('/api/auth/me')
    .then(res => {
      if (res.data)
        dispatch(setUser(res.data));
    })
    .catch(err => console.error('Unable to retrieve logged in user', err));
}

export const logout = () => dispatch => {
  axios.delete('/api/auth/logout')
    .then(() => {
      dispatch(removeUser());
      if (isBrowser()) {
        dispatch(fetchGoals());
        browserHistory.push('/');
      }
    })
    .catch(err => console.error('Unable to logout', err));
}
