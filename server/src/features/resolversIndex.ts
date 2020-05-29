import { CompanyMutation, CompanyQueries, CompanySubscription } from './company';

const rootResolver = {
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