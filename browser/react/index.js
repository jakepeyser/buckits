/* eslint-disable no-unused-vars*/

// React/Redux modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, Route, IndexRoute } from 'react-router';
import store from './store';
import { Provider } from 'react-redux';

// React containers and components
import App from './components/App';
import DiscoverContainer from './components/discover/DiscoverContainer';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/discover" component={DiscoverContainer} />
        <IndexRoute component={DiscoverContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
