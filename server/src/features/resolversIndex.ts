import { CompanyMutation, CompanyQueries, CompanySubscription } from './company';
import GraphQLJSON from 'graphql-type-json';

const rootResolver = {
  JSON: GraphQLJSON,
  Query: {
    ...CompanyQueries
    // Add other queries here
  },
  Mutation: {
    ...CompanyMutation
    // Add other mutations here
  },
  Subscription: {
    ...CompanySubscription
    // Add other subscriptions here
  }
};

export default rootResolver;