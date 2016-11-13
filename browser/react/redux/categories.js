import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

export const RETRIEVED_CATEGORIES = 'RETRIEVED_CATEGORIES';

/* ------------   ACTION CREATORS     ------------------ */

export const retrievedCategories = categories =>
  ({ type: RETRIEVED_CATEGORIES, categories });

/* ------------       REDUCER     ------------------ */

const initialCategories = [];
export default function reducer(currentCategories = initialCategories, action) {
  switch (action.type) {
    case RETRIEVED_CATEGORIES:
      return action.categories;
    default:
      return currentCategories;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchCategories = () => dispatch => {
  axios.get('/api/categories')
    .then(res => dispatch(retrievedCategories(res.data)))
    .catch(err => console.error('Unable to retrieve categories', err));
}
