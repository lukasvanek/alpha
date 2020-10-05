import axios from 'axios';
import * as R from 'ramda';
import '../src/mongoConnect';
import EOD from '../src/features/eod/model';
import Companies from '../src/features/company/model';

const MapToList = (m: any) => {
  return R.toPairs(m)
    .map((pair: object) => ({ id: pair[0], ...pair[1] }));
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const HOST = 'https://www.alphavantage.co';

const apiKeys = [
  '4TN0SWJWJ5FGT9N7',
  'VPT9W4THL8RKTUF3',
  '4821DXYG9KZH1CBO',
  'M5Q4RVAZB69G4ZI2',
  '1D8YSR5VBCESWS7Z',
  'SXJK4KV9CBSJS7Y6',
  'L49UYEWDQVFJW30S'
];

let apiKeyIndex = 0;
const getAPIkey = () => {
  const useKey = apiKeys[apiKeyIndex];
  const maxKey = apiKeys.length - 1;
  if (apiKeyIndex < maxKey) {
    apiKeyIndex++;
  } else {
    apiKeyIndex = 0;
  }
  return useKey;
}

const getHistoryURL = (ticker: string) => {
  const k = getAPIkey();
  console.log('using', k);
  return `${HOST}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=full&apikey=${k}`;
}

let useProxy = true;

const Request = async (url: string) => {
  try {
    let res = {};
    console.log('useProxy', useProxy);
    if (useProxy) {
      res = await axios.post('https://europe-west1-dinify.cloudfunctions.net/empty', { url });
    }
    else {
      res = await axios.get(url);
    }
    await timeout(12000 / apiKeys.length); // 5 per minute = 12s delay
    return res;
  } catch (e) {
    throw new Error(e);
  }
}

const correctQuote = (raw: any) => {
  let obj: any = {
    date: raw.id,
    open: Number(raw['1. open']),
    high: Number(raw['2. high']),
    low: Number(raw['3. low']),
    close: Number(raw['4. close']),
    vol: Number(raw['6. volume']),
  };
  const div = Number(raw['7. dividend amount']);
  const split = Number(raw['8. split coefficient']);
  if (div > 0) {
    obj.div = div;
  }
  if (split !== 1) {
    obj.split = split;
  }
  return obj;
}

const getHistory = async (ticker: string) => {
  console.log('fetching');
  let res: any = await Request(getHistoryURL(ticker));
  console.log('fetched');

  const data = res.data;
  console.log('parsed');

  if (!data['Time Series (Daily)']) {
    console.error(data);
    useProxy = !useProxy;
    console.log('useProxy', useProxy);
    console.error('waiting...');
    await timeout(100);
    console.error('retrying');
    return await getHistory(ticker);
  }

  const list = MapToList(data['Time Series (Daily)'])
    .map(correctQuote)
    .sort((a, b) => b.date.localeCompare(a.date));
  console.log('corrected', list.length);

  const finalList = [];
  let split = 1;
  list.forEach(o => {
    finalList.push({
      ...o,
      ticker,
      open: o.open / split,
      high: o.high / split,
      low: o.low / split,
      close: o.close / split,
    })
    if (o.split) {
      split = split * o.split;
    }    
  });
  console.log('finalized');

  return finalList;
}


const run = async () => {


  const companies = await Companies.find({ eodCompleted: {$exists: false} })

  console.log('doing it for', companies.length);
  await timeout(2000);

  for (let i = 0; i < companies.length; i++) {
    const c = companies[i];


    const list = await getHistory(c.ticker);

    for (let j = 0; j < list.length; j++) {
      const o = list[j];
      await EOD.update(
        { ticker: o.ticker, date: o.date },
        o,
        { upsert: true, setDefaultsOnInsert: true },
      );
    }
    await Companies.update({ ticker: c.ticker }, { eodCompleted: new Date() })
    console.log('DB_UPDATED', c.ticker)
      

  }

}

run()

const test = async () => {

  const url = 'https://web.dinify.app';
  try {
    const res = await axios.post('https://europe-west1-dinify.cloudfunctions.net/empty', { url });
    console.log(res.data);
  } catch (err) {
    console.log(err)
  }

}

// test();
