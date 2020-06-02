import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Bar } from 'react-chartjs-2';
import { Box, Button } from 'rebass';
import { colors } from '../theme';
import { lighten, transparentize } from 'polished';
import numeral from 'numeral';
import { fields } from '../fields';

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

const makeLabel = (x: any, field: any) => {
  let from = `${numeral(x.name.min).format(field.format)}`;
  let to = `${numeral(x.name.max).format(field.format)}`;
  if (field.percent) {
    from = from + '%';
    to = to + '%';
  }
  return `${from} - ${to}`.toUpperCase();
}

const Distribution = () => {

  const [selectedField, setSelectedField] = useState('RSI14');

  const distQuery = useQuery(DISTRIBUTION, {
    variables: { field: selectedField, boundaries: fields[selectedField].bounds }
  });

  let chartData = {};
  if (distQuery.data) {
    chartData = {
      labels: distQuery.data.distribution.map((x: any) => makeLabel(x, fields[selectedField])),
      datasets: [
        {
          label: selectedField,
          borderColor: colors.primary,
          borderWidth: 3,
          hoverBackgroundColor: transparentize(0.8, lighten(0.1, colors.primary)),
          hoverBorderColor: lighten(0.1, colors.primary),
          data: distQuery.data.distribution.map((x: any) => x.count)
        }
      ]
    };
  }

  return (
    <Box px={[20, 50, 100]}>

      {Object.keys(fields).map(fKey =>
        <Button mr={10} mb={10} variant='outline' className={fKey === selectedField ? 'active' : ''} onClick={() => {
          setSelectedField(fKey);
        }}>{fields[fKey].title || fKey}</Button>
      )}

      <Bar
        data={chartData}
        width={100}
        height={50}
      />

    </Box>
  );
}

export default Distribution;
