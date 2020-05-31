import React from 'react';
import { Box } from 'rebass';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Header from './Header';
import Distribution from './distribution';
import Screener from './screener';

const App = () => {

  return (
    <Box bg='background' pb={70}>
      <Router>
        <Header />
        <Switch>
          <Route path="/screener">
            <Screener />
          </Route>
          <Route path="/distribution">
            <Distribution />
          </Route>
          <Route path="/">
            <Redirect to="/screener" />
          </Route>
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
