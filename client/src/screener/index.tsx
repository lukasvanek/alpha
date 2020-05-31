import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import DataTable from 'react-data-table-component';
import { Box, Button } from 'rebass';
import { colors } from '../theme';

const COMPANIES = gql`
  query Companies ($limit: Int, $page: Int) {
    companies(limit: $limit, page: $page) {
      name,
      symbol,
      Price,
      RSI14,
      PE,
      PB,
      PS,
      Employees,
      Beta,
      Dividend
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
    grow: 3,
  },
  {
    name: 'Price',
    selector: 'Price',
    sortable: true,
    width: '70px'
  },
  {
    name: 'RSI14',
    selector: 'RSI14',
    sortable: true,
    width: '70px',
    conditionalCellStyles: [
      {
        when: (row: any) => row.RSI14 <= 40,
        style: { color: colors.green },
      },
      {
        when: (row: any) => row.RSI14 <= 30,
        style: { color: colors.green, fontWeight: 800 },
      },
      {
        when: (row: any) => row.RSI14 > 40 && row.RSI14 < 60,
        style: { color: colors.yellow },
      },
      {
        when: (row: any) => row.RSI14 >= 60,
        style: { color: colors.red },
      },
      {
        when: (row: any) => row.RSI14 >= 70,
        style: { color: colors.red, fontWeight: 800 },
      }
    ]
  },
  {
    name: 'P/E',
    selector: 'PE',
    sortable: true,
    width: '70px',
    conditionalCellStyles: [
      {
        when: (row: any) => row.PE <= 15,
        style: { color: colors.green },
      },
      {
        when: (row: any) => row.PE > 15 && row.PE < 25,
        style: { color: colors.yellow },
      },
      {
        when: (row: any) => row.PE >= 25,
        style: { color: colors.red },
      },
    ]
  },
  {
    name: 'P/S',
    selector: 'PS',
    sortable: true,
    width: '70px'
  },
  {
    name: 'P/B',
    selector: 'PB',
    sortable: true,
    width: '70px'
  },
  {
    name: 'Employees',
    selector: 'Employees',
    sortable: true,
    width: '80px'
  },
  {
    name: 'Beta',
    selector: 'Beta',
    sortable: true,
    width: '80px'
  },
  {
    name: 'Dividend',
    selector: 'Dividend',
    sortable: true,
    right: true,
    width: '80px'
  },
];

const Screener = () => {

  const [limit, setLimit] = useState(25);

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

  return (
    <Box px={[20, 50, 100]}>

      <Button variant='primary'>submit</Button>

      <DataTable
        theme="alpha"
        pagination
        paginationPerPage={limit}
        paginationServer
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
  );
}

export default Screener;
