import axios from 'axios';
import { LIKED_GOAL } from './goals'
import { UNLIKED_GOAL } from './goals'

/* -----------------    ACTIONS     ------------------ */

export const RETRIEVED_GOAL = 'RETRIEVED_GOAL';

/* ------------   ACTION CREATORS     ------------------ */

export const retrievedGoal = goal =>
  ({ type: RETRIEVED_GOAL, goal });

/* ------------       REDUCER     ------------------ */

const initialGoal = {};
export default function reducer(currentGoal = initialGoal, action) {
  switch (action.type) {
    case RETRIEVED_GOAL:
      return action.goal;
    case LIKED_GOAL:
      return currentGoal.id === action.goalId ?
        Object.assign({}, currentGoal, {
          liked: true,
          likes: ++currentGoal.likes
        }) : currentGoal;
    case UNLIKED_GOAL:
      return currentGoal.id === action.goalId ?
        Object.assign({}, currentGoal, {
          liked: false,
          likes: --currentGoal.likes
        }) : currentGoal;
    default:
      return currentGoal;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchGoal = (goalId) => dispatch => {
  axios.get(`/api/goals/${goalId}`)
    .then(res => dispatch(retrievedGoal(res.data)))
    .catch(err => console.error('Unable to retrieve goal', err));
}
