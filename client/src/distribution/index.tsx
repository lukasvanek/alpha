import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Bar } from 'react-chartjs-2';
import { Box, Button } from 'rebass';
import { colors } from '../theme';
import { lighten, transparentize } from 'polished';

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

// { field: 'PE', boundaries: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 10000] },
// { field: 'RSI14', boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
// { field: 'Employees', boundaries: [0, 50, 100, 500, 1000, 10000, 100000, 10000000] },
// { field: 'Recom', boundaries: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 10] },

const Distribution = () => {

  const [selectedField, setSelectedField] = useState('RSI14');

  const distResponse = useQuery(DISTRIBUTION, {
    variables: { field: selectedField, boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
    fetchPolicy: "cache-and-network"
  });

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
    <Box px={[20, 50, 100]}>

      <Button variant='primary'>submit</Button>

      <Bar
        data={chartData}
        width={100}
        height={50}
      />

    </Box>
  );
}

export default Distribution;
