import mongoose, { Schema } from 'mongoose';

const CompaniesSchema = new Schema({
  ticker: String,
  exchange: String,
  name: String,
  sector: String,
  industry: String,
  country: String,
  symbol: {
    type: String,
    required: true
  },
  Index: String,
  PE: Number,
  EPSttm: Number,
  InsiderOwn: Number,
  ShsOutstand: Number,
  PerfWeek: Number,
  MarketCap: Number,
  ForwardPE: Number,
  EPSnextY: Number,
  InsiderTrans: Number,
  ShsFloat: Number,
  PerfMonth: Number,
  Income: Number,
  PEG: Number,
  EPSnextQ: Number,
  InstOwn: Number,
  ShortFloat: Number,
  PerfQuarter: Number,
  Sales: Number,
  PS: Number,
  EPSthisY: Number,
  InstTrans: Number,
  ShortRatio: Number,
  PerfHalfY: Number,
  Booksh: Number,
  PB: Number,
  ROA: Number,
  TargetPrice: Number,
  PerfYear: Number,
  Cashsh: Number,
  PC: Number,
  EPSnext5Y: Number,
  ROE: Number,
  '52WRange': Array,
  PerfYTD: Number,
  Dividend: Number,
  PFCF: Number,
  EPSpast5Y: Number,
  ROI: Number,
  '52WHigh': Number,
  Beta:Number,
  QuickRatio: Number,
  Salespast5Y: Number,
  GrossMargin: Number,
  '52WLow': Number,
  ATR: Number,
  Employees: Number,
  CurrentRatio: Number,
  SalesQQ: Number,
  OperMargin: Number,
  RSI14: Number,
  Volatility: Array,
  Optionable: Boolean,
  DebtEq: Number,
  EPSQQ: Number,
  ProfitMargin: Number,
  RelVolume: Number,
  PrevClose: Number,
  Shortable: Boolean,
  LTDebtEq: Number,
  Earnings: String,
  Payout: Number,
  AvgVolume: Number,
  Price: Number,
  Recom: Number,
  SMA20: Number,
  SMA50: Number,
  SMA200: Number,
  Volume: Number,
  Change: Number
}, {
  timestamps: true
});

/**
 * Statics
 */
CompaniesSchema.statics = {
  /**
   * Get Company
   * @param {string} symbol - The symbol of company (exchange:ticker)
   */
  get(symbol: string): mongoose.Document {
    return this.findOne({ symbol })
      .execAsync()
      .then((company: any) => {
        if (company) {
          return company;
        }
      });
  }
};

CompaniesSchema.index({ symbol: 1 }, { unique: true });
CompaniesSchema.index({ PE: 1 });
CompaniesSchema.index({ MarketCap: -1 });
CompaniesSchema.index({ name: 'text' });
CompaniesSchema.index({ createdAt: 1, updatedAt: 1 });



const Companies = mongoose.model('companies', CompaniesSchema);

export default Companies;
