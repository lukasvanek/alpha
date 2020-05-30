import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './App.css';

const COMPANIES = gql`
  {
    companies(limit: 120, page: 10) {
      name,
      Price,
      symbol,
      PE,
      Employees,
      Beta,
      Dividend
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(COMPANIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      {JSON.stringify(data)}
    </div>
  );
}

export default App;
