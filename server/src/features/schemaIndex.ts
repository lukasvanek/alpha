import { gql } from 'apollo-server-express';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import resolvers from './resolversIndex';
import CompanySchema from './company/schema';

const MainTypeDefs = gql`
  type Paginated {
    docs: [Company]
    totalDocs: Int
    limit: Int
    totalPages: Int
    page: Int
    pagingCounter: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    prevPage: Int,
    nextPage: Int
  }
  scalar JSON
  type Query {
    companies(query: JSON, page: Int, limit: Int, sortBy: String, sortDir: Int): Paginated
    company(symbol: String!): Company!
    distribution(field: String!, boundaries: [Float]): [DistributionItem]
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