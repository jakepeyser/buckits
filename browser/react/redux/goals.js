import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

export const RETRIEVED_GOALS = 'RETRIEVED_GOALS';
export const LIKED_GOAL = 'LIKED_GOAL';
export const UNLIKED_GOAL = 'UNLIKED_GOAL';

/* ------------   ACTION CREATORS     ------------------ */

export const retrievedGoals = goals => ({ type: RETRIEVED_GOALS, goals });
export const likedGoal = goalId => ({ type: LIKED_GOAL, goalId });
export const unlikedGoal = goalId => ({ type: UNLIKED_GOAL, goalId });

/* ------------       REDUCER     ------------------ */

const initialGoals = [];
export default function reducer(currentGoals = initialGoals, action) {
  switch (action.type) {
    case RETRIEVED_GOALS:
      return action.goals;
    case LIKED_GOAL:
      return currentGoals.map(goal => {
        if (goal.id === action.goalId) {
          goal.liked = true;
          goal.likes++;
        }
        return goal;
      })
    case UNLIKED_GOAL:
      return currentGoals.map(goal => {
        if (goal.id === action.goalId) {
          goal.liked = false;
          goal.likes--;
        }
        return goal;
      })
    default:
      return currentGoals;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchGoals = (categoryId) => dispatch => {
  const queryCategory = categoryId ? `category=${categoryId}` : '';
  axios.get(`/api/goals?${queryCategory}`)
    .then(res => dispatch(retrievedGoals(res.data)))
    .catch(err => console.error('Unable to retrieve categories', err));
}

export const likeGoal = (goalId) => dispatch => {
  axios.post(`/api/goals/${goalId}/like`)
    .then(res => dispatch(likedGoal(goalId)))
    .catch(err => console.error('Unable to like goal', err));
}

export const unlikeGoal = (goalId) => dispatch => {
  axios.delete(`/api/goals/${goalId}/like`)
    .then(res => dispatch(unlikedGoal(goalId)))
    .catch(err => console.error('Unable to unlike goal', err));
}
