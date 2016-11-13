import { combineReducers } from 'redux';
import user from './user'
import goals from './goals'
import categories from './categories'

export default combineReducers({
  goals,
  categories,
  user
});
