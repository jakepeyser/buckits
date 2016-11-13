/* eslint-disable no-unused-vars*/

// React/Redux modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, Route, IndexRoute } from 'react-router';
import store from './store';
import { Provider } from 'react-redux';

// React containers and components
import App from './components/App';
import GoalsContainer from './components/goals/GoalsContainer';
import GoalContainer from './components/goal/GoalContainer';
import SigninContainer from './components/signin/SigninContainer';

// Redux thunks
import { retrieveLoggedInUser } from './redux/user'
import { fetchGoals } from './redux/goals'
import { fetchGoal } from './redux/goal'
import { fetchCategories } from './redux/categories'

// Route hooks
const appEnter = () => {
  store.dispatch(fetchCategories());
  store.dispatch(fetchGoals());
  store.dispatch(retrieveLoggedInUser());
}
const goalEnter = nextState => {
  store.dispatch(fetchGoal(nextState.params.goalId));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={appEnter}>
        <Route path="/sign-in" component={SigninContainer} form="sign-in"/>
        <Route path="/sign-up" component={SigninContainer} form="sign-up"/>
        <Route path="/goals/:goalId" component={GoalContainer} onEnter={goalEnter}/>
        <IndexRoute component={GoalsContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
