import React from 'react';
import { Heading, Text } from 'rebass';

const Header = () => {
  return (
    <Heading
      fontSize={[ 2, 3, 4 ]}
      sx={{
        borderTop: '5px solid'
      }}
      color='primary'
      py={[20, 30, 50]}
      px={[20, 50, 100]}
    >
      <Text
        sx={{
          letterSpacing: '0.84rem',
          fontWeight: 300,
        }}          
      >
        αlphα
        <span style={{
          letterSpacing: '0.66rem',
          color: 'rgba(178, 202, 255, 0.3)'
        }}>|</span>
        <span style={{
          letterSpacing: '0.42rem',
          color: 'rgba(178, 202, 255, 0.3)'
        }}>analytics</span>
      </Text>

    </Heading>
  );
}

export default Header;
