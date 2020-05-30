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
  },
  distribution: async (_, { field, boundaries }) => {
    let bucket: any = {
      $bucketAuto: {
        groupBy : `$${field}`, 
        buckets: 8,
        granularity: "E6",
        output : {
          "count" : {$sum : 1}
        }
      }
    };
    if (boundaries) {
      bucket = {
        $bucket: {
          groupBy: `$${field}`, 
          boundaries,
          default: "Other", 
          output : {
            "count" : {$sum : 1}
          }
       }
      }
    }
    try {
      const dist = await Companies.aggregate([
        { 
          "$match": {
            [field]: { 
              "$exists": true, 
              "$ne": null
            }
          }    
        },
        bucket,
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1
          }
        }
      ]);
      console.log(dist);
      if (boundaries) {
        const appliedBoundaries = dist.map(d => d.name);
        return dist.map((d, i) => {
          if (d.name === 'Other') {
            return {...d, name: {min: 0, max: boundaries[boundaries.length-1]} };
          }
          return { ...d, name: {min: d.name, max: appliedBoundaries[i+1] || boundaries[boundaries.length-1] } };
        })
      }
      return dist;
    } catch (err) {
      throw err;
    }
  },
};

const CompanyMutation = {

};

const CompanySubscription = {
  companyUpdated: {
    subscribe: () => pubsub.asyncIterator([Company_UPDATED])
  }
};

export { CompanyQueries, CompanyMutation, CompanySubscription };
