
import { InfluxDB, HttpError } from '@influxdata/influxdb-client';
import moment from 'moment';
import '../src/mongoConnect';
import EOD from '../src/features/eod/model';


/** InfluxDB v2 URL */
const url = 'http://localhost:9999'
/** InfluxDB authorization token */
const token = 'tqOE9huRB9IRyCOol-AgtVFA14H0R2DqPatIsPQE6wkeUjblLiM1pYI3Pgnk3aTGljAYkzWJNyGSttY2QsQkJA=='
/** Organization within InfluxDB URL  */
const org = 'alpha'
/**InfluxDB bucket used in examples  */
const bucket = 'alpha'
// ONLY onboarding example
/**InfluxDB user  */
const username = 'alpha'
/**InfluxDB password  */
const password = 'alphakheslu'

console.log('*** WRITE POINTS ***')


const genInsert = ({ ticker, open, high, low, close, vol, date }) => {
  const timestamp = moment.utc(`${date}T21:00:00.000000000Z`).valueOf() * 1000000;
  return `eod,ticker=${ticker} open=${open},high=${high},low=${low},close=${close},volume=${vol} ${timestamp}`;
}



const migrate = async (ticker: string) => {
  const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket);
  const docs = await EOD.find({ ticker });

  console.log(docs.length, ticker)

  docs.forEach(o => {
    const ins = genInsert(o);
    writeApi.writeRecord(ins);
  });

  return await writeApi.close();
}

const start = async () => {
  const tickers = await EOD.distinct('ticker');

  for (let index = 0; index < tickers.length; index++) {
    const ticker = tickers[index];
    await migrate(ticker);
  }
  
}

start();



