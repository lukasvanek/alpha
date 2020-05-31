import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import DataTable from 'react-data-table-component';
import { Bar } from 'react-chartjs-2';
import { Heading, Box, Button } from 'rebass';
import { colors } from './theme';
import { lighten, transparentize } from 'polished';

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
  query Distribution ($field: String!, $boundaries: [Float]) {
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
// { field: 'Recom', boundaries: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 10] },

const App = (props: any) => {
  console.log(props)

  const [limit, setLimit] = useState(10);
  const [selectedField, setSelectedField] = useState('RSI14');

  const distResponse = useQuery(DISTRIBUTION, {
    variables: { field: selectedField, boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
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
          label: selectedField,
          borderColor: colors.primary,
          borderWidth: 3,
          hoverBackgroundColor: transparentize(0.8, lighten(0.1, colors.primary)),
          hoverBorderColor: lighten(0.1, colors.primary),
          data: distResponse.data.distribution.map((x: any) => x.count)
        }
      ]
    };
  }


  return (
    <Box sx={{ mx: 'auto', px: 3 }} bg='background'>
      <Box mx={[20, 50, 100]}>
        <Heading fontSize={[ 4, 5, 6 ]} color='primary' py={[20, 30, 50]}>
          Alpha
        </Heading>
        <Button variant='primary'>hello</Button>
        <Button variant='outline'>hello</Button>
        <Button variant='secondary'>hello</Button>
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
      </Box>
    </Box>
  );
}

export default App;
