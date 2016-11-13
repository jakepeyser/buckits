import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

export const RETRIEVED_GOAL = 'RETRIEVED_GOAL';

/* ------------   ACTION CREATORS     ------------------ */

export const retrievedGoal = goal =>
  ({ type: RETRIEVED_GOAL, goal });

/* ------------       REDUCER     ------------------ */

const initialGoal = null;
export default function reducer(currentGoal = initialGoal, action) {
  switch (action.type) {
    case RETRIEVED_GOAL:
      return action.goal.id;
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
