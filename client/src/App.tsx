import React from 'react';
import { Box } from 'rebass';

import Header from './Header';
import Distribution from './distribution';
import Screener from './screener';

const App = () => {

  return (
    <Box bg='background'>
      <Header />
        
      <Distribution />
      <Screener />
    </Box>
  );
}

export default App;
