import { combineReducers } from 'redux';
import user from './user'
import goals from './goals'

export default combineReducers({
  goals,
  user
});
