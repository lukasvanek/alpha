import { gql } from 'apollo-server-express';

export default gql`
  type Company {
    _id: ID!
    symbol: String!
    name: String!
    Price: Float!
  }
`;
