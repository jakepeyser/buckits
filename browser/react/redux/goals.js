import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

export const RETRIEVED_GOALS    = 'RETRIEVED_GOALS'

/* ------------   ACTION CREATORS     ------------------ */

export const retrievedGoals = goals => ({ type: RETRIEVED_GOALS, goals })

/* ------------       REDUCER     ------------------ */

const initialGoals = [];
export default function reducer(currentGoals = initialGoals, action) {
  switch (action.type) {
    case RETRIEVED_GOALS:
      return action.goals;
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
