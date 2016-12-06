import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { Provider, observer } from 'mobx-react';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import AppState from '../stores/AppState';
import Home from './Home';

const appState = new AppState;

const stores = {
  appstate: appState,
  // ...other stores
};

class App extends Component {
  render() {
    return (
      <Provider {... stores}>
        <Router history={hashHistory}>
          <Route path="/" component={ Home } />
        </Router>
      </Provider>
    );
  }
}

export default App;
