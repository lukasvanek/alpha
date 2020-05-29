import { PubSub, IResolvers } from 'apollo-server';
import Companies from './model';
const pubsub = new PubSub();

const Company_UPDATED = 'Company_UPDATED';

const CompanyQueries = {
  companies: async (_, args) => {
    const { page = 1, limit = 20 } = args;
    try {
      const companies = await Companies
        .find()
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();
      return companies;
    } catch (err) {
      throw err;
    }
  },
  company: async (_, { symbol }) => {
    try {
      const Company = await Companies.get(symbol).lean();
      return Company;
    } catch (err) {
      throw err;
    }
  }
};

const CompanyMutation = {

};

const CompanySubscription = {
  companyUpdated: {
    subscribe: () => pubsub.asyncIterator([Company_UPDATED])
  }
};

export { CompanyQueries, CompanyMutation, CompanySubscription };
