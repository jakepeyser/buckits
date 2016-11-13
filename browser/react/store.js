import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './redux';
import { isBrowser } from './utils'

// Setup Redux middleware based on env
const middleware = [ thunkMiddleware ];
if (isBrowser())
  middleware.push(createLogger());

export default createStore(
  rootReducer,
  applyMiddleware( ...middleware )
);
