import axios from 'axios';
import cheerio from 'cheerio';
import * as R from 'ramda';
import '../src/mongoConnect';
import Companies from '../src/features/company/model';

const HOST = 'https://finviz.com';

const getQuoteURL = (ticker: string) => {
  return `${HOST}/quote.ashx?t=${ticker}`;
}

const getScreenerURL = (offset: number) => {
  return `${HOST}/screener.ashx?v=110&r=${offset}`
}

function timeout(ms) {
  
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Request = async (url: string, tried: number = 0) => {
  try {
    console.log('SUCCESS ', url);
    const res = await axios(url);
    return res;
  } catch (e) {
    console.log('FAIL ', url);
    if (tried > 10) {
      throw new Error(e);
    }
    console.log('Waiting to retry ', url);
    await timeout(30 * 1000);
    return await Request(url, tried + 1);
  }
}


const correctExchange = (str: string) => {
  let ex = str.replace(/[\[\]']+/g,'');
  if (ex === 'NASD') {
    return 'NASDAQ';
  }
  return ex;
}

const parseMeta = (res: any) => {
  const html = res.data;
  const $ = cheerio.load(html);

  const meta = {
    ticker: $('.fullview-title tbody > tr:nth-child(1) > td > a').text(),
    exchange: correctExchange($('.fullview-title tbody > tr:nth-child(1) > td > span').text()),
    name: $('.fullview-title tbody > tr:nth-child(2) > td').text(),
    sector: $('.fullview-title tbody > tr:nth-child(3) > td > a:nth-child(1)').text(),
    industry: $('.fullview-title tbody > tr:nth-child(3) > td > a:nth-child(2)').text(),
    country: $('.fullview-title tbody > tr:nth-child(3) > td > a:nth-child(3)').text(),
  };

  return {...meta, symbol: `${meta.exchange}:${meta.ticker}`};
}

const correctValueType = (str, key) => {
  if (str === 'Yes') {
    return true;
  }
  if (str === 'No') {
    return false;
  }
  if (str === '-') {
    return null;
  }
  if (!isNaN(str)) {
    return Number(str);
  }
  if (str.includes('%')) {
    const num = str.replace('%', '');
    if (!isNaN(num)) {
      return Number(num);
    }
  }
  if (str.includes('B')) {
    const num = str.replace('B', '');
    if (!isNaN(num)) {
      return Number(num) * 1000000000;
    }
  }
  if (str.includes('M')) {
    const num = str.replace('M', '');
    if (!isNaN(num)) {
      return Number(num) * 1000000;
    }
  }
  if (str.includes('K')) {
    const num = str.replace('K', '');
    if (!isNaN(num)) {
      return Number(num) * 1000;
    }
  }
  if (key === 'Volume') {
    return Number(str.replace(/,/g,''));
  }
  if (key === 'Volatility') {
    return str.split(' ').map(s => Number(s.replace('%', '')))
  }
  if (key === '52WRange') {
    return str.split(' - ').map(s => Number(s))
  }
  return str;
}

const removeChars = (str: string, chars: any[]) => {
  let newStr = str;
  chars.map(char => newStr = newStr.replace(char, ''));
  return newStr;
}

const correctKeyString = (str: string) => {
  return removeChars(str, [/ /g, '(', ')', '.', '%', '/']);
}

const parseStats = (res) => {
  const html = res.data;
  const $ = cheerio.load(html);

  const vals = [];
  const keys = [];

  $('.snapshot-table2 > tbody > tr').each((i, element) => {

    $(element).find('td').each((j, el) => {
      let x = $(el).text();

      if (j % 2 === 0) {
        x = correctKeyString(x);
        keys.push(x);
      } else {
        x = correctValueType(x, R.last(keys));
        vals.push(x);
      }

    })
  });
  return R.zipObj(keys, vals);
}

const fetchQuoteData = async (ticker) => {
  try {
    const res = await Request(getQuoteURL(ticker));
    return {
      ...parseMeta(res),
      ...parseStats(res),
    }
  } catch (e) {
    throw new Error(e);
  }
}

const parseTickers = (res) => {
  const html = res.data;
  const $ = cheerio.load(html);

  let tickers = [];

  const trs = R.pipe(
    $ => $('#screener-content table table tr').toArray(),
    a => R.drop(3, a),
    a => R.dropLast(1, a)
  )($);

  tickers = trs.map((element) => {

    const tds = $(element).find('td').toArray();

    const el = tds[1];
    
    return $(el).text();

  });
  return tickers;
}

const fetchTickersData = async (offset) => {
  try {
    const res = await Request(getScreenerURL(offset));
    return parseTickers(res);
  } catch (e) {
    throw new Error(e);
  }
}

const processTickers = (tickers) => {
  tickers.map(async (ticker) => {
    const cmpn = await fetchQuoteData(ticker);
    Companies.update(
      { symbol: cmpn.symbol },
      cmpn,
      { upsert: true, setDefaultsOnInsert: true },
      () => console.log('DB_UPDATED', cmpn.symbol)
    );
  })
}

const run = async () => {
  let tickers = [];
  let starWithNo = 1000;
  let newTickers = [];

  while (tickers.length === 0 || newTickers.length > 1) {
    newTickers = await fetchTickersData(starWithNo);
    processTickers(newTickers);
    tickers = [...tickers, ...newTickers];
    starWithNo += 20;
  }

  console.log('DONE')
  
}

run();
