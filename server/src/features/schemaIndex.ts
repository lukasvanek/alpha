import { gql } from 'apollo-server-express';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import resolvers from './resolversIndex';
import CompanySchema from './company/schema';

const MainTypeDefs = gql`
  type Query {
    companies(page: Int, limit: Int): [Company!]!
    company(symbol: String!): Company!
  }
  type Mutation {
    symbol: String!
  }
  type Subscription {
    companyUpdated: Company
  }
`;

const schema: ApolloServerExpressConfig = {
  typeDefs: [MainTypeDefs, CompanySchema],
  resolvers,
  introspection: true,
  context: async ({ req, connection, payload }: any) => {
    if (connection) {
      return { isAuth: payload.authToken };
    }
    return { isAuth: req.isAuth };
  },
  playground: true
};

export default schema;