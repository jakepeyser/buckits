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
import SigninContainer from './components/signin/SigninContainer';

// Redux thunks
import { fetchGoals } from './redux/goals'
import { fetchCategories } from './redux/categories'

// Route hooks
const appEnter = () => {
  store.dispatch(fetchCategories());
  store.dispatch(fetchGoals());
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={appEnter}>
        <Route path="/sign-in" component={SigninContainer} form="sign-in"/>
        <Route path="/sign-up" component={SigninContainer} form="sign-up"/>
        <IndexRoute component={GoalsContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
