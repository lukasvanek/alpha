import { PubSub, IResolvers } from 'apollo-server';
import Companies from './model';
const pubsub = new PubSub();

const Company_UPDATED = 'Company_UPDATED';

const CompanyQueries = {
  companies: async (_, args) => {
    const { page = 1, limit = 20, sortBy = 'ticker', sortDir = 1 } = args;
    try {
      const options = {
        sort: { [sortBy]: sortDir },
        lean: true,
        page,
        limit
      };
      const query = {
        [sortBy]: { $exists: true, $ne: null }
      }
      const companies = await Companies.paginate(query, options);
      console.log(companies);
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
          default: 'other', 
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


      if (boundaries) {
        const appliedBoundaries = dist.map(d => d.name).filter(d => d !== 'other');
        const edited = dist.map((d, i) => {
          if (d.name === 'other') {
            return {
              count: d.count,
              name: { min: 0, max: boundaries[boundaries.length-1] }
            };
          }
          return {
            count: d.count,
            name: { min: d.name, max: appliedBoundaries[i+1] || boundaries[boundaries.length-1] }
          };
        })
        return edited;
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
