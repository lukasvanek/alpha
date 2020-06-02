import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoosePaginate from 'mongoose-paginate-v2';

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

CompaniesSchema.index({ name: 'text' });
CompaniesSchema.index({ symbol: 1 }, { unique: true });
CompaniesSchema.index({ Index: 1 });
CompaniesSchema.index({ PE: 1 });
CompaniesSchema.index({ EPSttm: 1 });
CompaniesSchema.index({ InsiderOwn: 1 });
CompaniesSchema.index({ ShsOutstand: 1 });
CompaniesSchema.index({ PerfWeek: 1 });
CompaniesSchema.index({ MarketCap: 1 });
CompaniesSchema.index({ ForwardPE: 1 });
CompaniesSchema.index({ EPSnextY: 1 });
CompaniesSchema.index({ InsiderTrans: 1 });
CompaniesSchema.index({ ShsFloat: 1 });
CompaniesSchema.index({ PerfMonth: 1 });
CompaniesSchema.index({ Income: 1 });
CompaniesSchema.index({ PEG: 1 });
CompaniesSchema.index({ EPSnextQ: 1 });
CompaniesSchema.index({ InstOwn: 1 });
CompaniesSchema.index({ ShortFloat: 1 });
CompaniesSchema.index({ PerfQuarter: 1 });
CompaniesSchema.index({ Sales: 1 });
CompaniesSchema.index({ PS: 1 });
CompaniesSchema.index({ EPSthisY: 1 });
CompaniesSchema.index({ InstTrans: 1 });
CompaniesSchema.index({ ShortRatio: 1 });
CompaniesSchema.index({ PerfHalfY: 1 });
CompaniesSchema.index({ Booksh: 1 });
CompaniesSchema.index({ PB: 1 });
CompaniesSchema.index({ ROA: 1 });
CompaniesSchema.index({ TargetPrice: 1 });
CompaniesSchema.index({ PerfYear: 1 });
CompaniesSchema.index({ Cashsh: 1 });
CompaniesSchema.index({ PC: 1 });
CompaniesSchema.index({ EPSnext5Y: 1 });
CompaniesSchema.index({ ROE: 1 });
CompaniesSchema.index({ PerfYTD: 1 });
CompaniesSchema.index({ Dividend: 1 });
CompaniesSchema.index({ PFCF: 1 });
CompaniesSchema.index({ EPSpast5Y: 1 });
CompaniesSchema.index({ ROI: 1 });
CompaniesSchema.index({ '52WHigh': 1 });
CompaniesSchema.index({ Beta: 1 });
CompaniesSchema.index({ QuickRatio: 1 });
CompaniesSchema.index({ Salespast5Y: 1 });
CompaniesSchema.index({ GrossMargin: 1 });
CompaniesSchema.index({ '52WLow': 1 });
CompaniesSchema.index({ ATR: 1 });
CompaniesSchema.index({ Employees: 1 });
CompaniesSchema.index({ CurrentRatio: 1 });
CompaniesSchema.index({ SalesQQ: 1 });
CompaniesSchema.index({ OperMargin: 1 });
CompaniesSchema.index({ RSI14: 1 });
CompaniesSchema.index({ DebtEq: 1 });
CompaniesSchema.index({ EPSQQ: 1 });
CompaniesSchema.index({ ProfitMargin: 1 });
CompaniesSchema.index({ RelVolume: 1 });
CompaniesSchema.index({ PrevClose: 1 });
CompaniesSchema.index({ LTDebtEq: 1 });
CompaniesSchema.index({ Payout: 1 });
CompaniesSchema.index({ AvgVolume: 1 });
CompaniesSchema.index({ Price: 1 });
CompaniesSchema.index({ Recom: 1 });
CompaniesSchema.index({ SMA20: 1 });
CompaniesSchema.index({ SMA50: 1 });
CompaniesSchema.index({ SMA200: 1 });
CompaniesSchema.index({ Volume: 1 });

CompaniesSchema.index({ createdAt: 1, updatedAt: 1 });
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
CompaniesSchema.plugin(updateIfCurrentPlugin, { strategy: 'timestamp' });
CompaniesSchema.plugin(mongoosePaginate);



const Companies = mongoose.model('companies', CompaniesSchema);

export default Companies;
