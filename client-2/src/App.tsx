import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './components/home';
import Document from './components/document';

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:docId">
          <Document />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
