import { combineReducers } from 'redux';
import user from './user'
import goals from './goals'
import currentGoal from './goal'
import categories from './categories'

export default combineReducers({
  goals,
  currentGoal,
  categories,
  user
});
