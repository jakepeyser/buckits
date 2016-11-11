import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './redux';

// Setup Redux middleware based on env
const middleware = [ thunkMiddleware ];
// if (window.location.host.slice(0, 9) === 'localhost') // failing .travis.yml
middleware.push(createLogger());

export default createStore(
  rootReducer,
  applyMiddleware( ...middleware )
);
