import mongoose, { Schema } from 'mongoose';

const EODSchema = new Schema({
  ticker: String,
  date: String,

  open: Number,
  high: Number,
  low: Number,
  close: Number,

  vol: Number,

  split: Number,
  div: Number
}, {
  timestamps: true
});

EODSchema.index({ ticker: 1, date: 1 }, { unique: true });
EODSchema.index({ createdAt: 1, updatedAt: 1 });

const EOD = mongoose.model('eods', EODSchema);

export default EOD;
