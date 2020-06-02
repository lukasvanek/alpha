import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import DataTable from 'react-data-table-component';
import { Box, Button } from 'rebass';
import { colors } from '../theme';
import numeral from 'numeral';

const COMPANIES = gql`
  query Companies ($limit: Int, $page: Int, $sortBy: String, $sortDir: Int) {
    companies(limit: $limit, page: $page, sortBy: $sortBy, sortDir: $sortDir) {
      docs {
        name,
        symbol,
        Price,
        MarketCap,
        RSI14,
        Recom,
        PE,
        PB,
        PS,
        Employees,
        Beta,
        Dividend
      },
      totalDocs
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
    width: '80px',
    allowOverflow: true,
  },
  {
    name: 'Market Cap.',
    selector: 'MarketCap',
    sortable: true,
    width: '90px',
    format: (row: any) => {
      if (!row.MarketCap) return '';
      return numeral(row.MarketCap).format('0.0a').toUpperCase();
    }
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
    name: 'Recom',
    selector: 'Recom',
    sortable: true,
    width: '70px',
    conditionalCellStyles: [
      {
        when: (row: any) => row.Recom <= 2,
        style: { color: colors.green },
      },
      {
        when: (row: any) => row.Recom >= 4,
        style: { color: colors.red },
      }
    ]
  },
  {
    name: 'P/E',
    selector: 'PE',
    sortable: true,
    width: '70px',
    allowOverflow: true,
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
    width: '70px',
    allowOverflow: true,
  },
  {
    name: 'P/B',
    selector: 'PB',
    sortable: true,
    width: '70px',
    allowOverflow: true,
  },
  {
    name: 'Employees',
    selector: 'Employees',
    sortable: true,
    allowOverflow: true,
    width: '80px',
    format: (row: any) => {
      if (!row.Employees) return '';
      return numeral(row.Employees).format('0,0');
    }
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

type SortBy = {[by: string]: number};

const Screener = () => {

  const [limit, setLimit] = useState(25);
  const [sortBy, setSortBy] = useState({ ticker: 1 } as SortBy);

  const { loading, error, data, fetchMore } = useQuery(COMPANIES, {
    variables: { page: 1, limit, sortBy: Object.keys(sortBy)[0], sortDir: sortBy[Object.keys(sortBy)[0]]},
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
        paginationTotalRows={data ? data.companies.totalDocs : 0}
        columns={columns}
        data={data ? data.companies.docs : []}
        onChangeRowsPerPage={(newPerPage, page) => {
          setLimit(newPerPage);
          giveMeMore(page, newPerPage);
        }}
        onChangePage={(page) => giveMeMore(page, limit)}
        sortServer
        onSort={(col, sortDir) => {
          const sortObj = { [col.selector as string]: sortDir === 'asc' ? 1 : -1 };
          setSortBy(sortObj);
        }}
      />
    </Box>
  );
}

export default Screener;
