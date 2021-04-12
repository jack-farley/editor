import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { SocketContext, socket } from './context/socket';
import Home from './components/Home';
import Document from './components/Document';

import './App.css';

function App() {
  return (
    <SocketContext.Provider value={socket}>
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
    </SocketContext.Provider>
  );
}

export default App;
