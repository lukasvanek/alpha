import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import DataTable from 'react-data-table-component';
import { Bar } from 'react-chartjs-2';

const COMPANIES = gql`
  query Companies ($limit: Int, $page: Int) {
    companies(limit: $limit, page: $page) {
      name,
      symbol,
      Price,
      PE,
      Employees,
      Beta,
      Dividend
    }
  }
`;

const DISTRIBUTION = gql`
  query Distribution ($field: String!, $boundaries: [Int]) {
    distribution(field: $field, boundaries: $boundaries) {
      name {
        min, max
      },
      count
    }
  }
`;

const columns = [
  {
    name: 'Symbol',
    selector: 'symbol',
    sortable: true,
  },
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Price',
    selector: 'Price',
    sortable: true,
  },
  {
    name: 'P/E',
    selector: 'PE',
    sortable: true,
  },
  {
    name: 'Employees',
    selector: 'Employees',
    sortable: true,
  },
  {
    name: 'Beta',
    selector: 'Beta',
    sortable: true,
  },
  {
    name: 'Dividend',
    selector: 'Dividend',
    sortable: true,
    right: true
  },
];

// { field: 'PE', boundaries: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 10000] },
// { field: 'RSI14', boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
// { field: 'Employees', boundaries: [0, 50, 100, 500, 1000, 10000, 100000, 10000000] },

function App() {
  const [limit, setLimit] = useState(10);
  const distResponse = useQuery(DISTRIBUTION, {
    variables: { field: 'Recom', boundaries: [0, 1, 2, 3, 4, 5, 10] },
    fetchPolicy: "cache-and-network"
  });
  const { loading, error, data, fetchMore } = useQuery(COMPANIES, {
    variables: { page: 1, limit },
    fetchPolicy: "cache-and-network"
  });



  const giveMeMore = (page: number, limit: number) => {
    fetchMore({
      variables: { page, limit },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, fetchMoreResult);
      }
    })
  }

  if (error) return <p>Error :(</p>;


  let chartData = {};
  if (distResponse.data) {
    chartData = {
      labels: distResponse.data.distribution.map((x: any) => `${x.name.min.toFixed(1)}-${x.name.max.toFixed(1)}`),
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: distResponse.data.distribution.map((x: any) => x.count)
        }
      ]
    };
  }


  return (
    <div className="App">
      <Bar
        data={chartData}
        width={100}
        height={50}
      />
      <DataTable
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={7000}
        columns={columns}
        data={data ? data.companies : []}
        onChangeRowsPerPage={(newPerPage, page) => {
          setLimit(newPerPage);
          giveMeMore(page, newPerPage);
        }}
        onChangePage={(page) => giveMeMore(page, limit)}
      />
    </div>
  );
}

export default App;
