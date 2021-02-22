const fetch = require('node-fetch');
const moment = require('moment')
const { Parser } = require('json2csv');
const fs = require('fs');

const DATE_FORMAT = 'MM/DD/YYYY HH:mm:ss A';

async function main() {

  if (process.argv.length < 5) {
    console.error('Insufficient params')
    console.log("Usage: 'node index.js symbol fromTimestamp toTimestamp outputFileName'")
    console.log("Example: 'node index.js mBTCUSDT 1613347200000 1613491200338 output.csv'")
    return
  }

  const symbol = process.argv[2]
  const fromTimestamp = process.argv[3]
  const toTimestamp = process.argv[4]
  const filename = process.argv[5]

  const url = `http://wapi.binance.com/fapi/v1/marketKlines?symbol=${symbol}&limit=1000&startTime=${fromTimestamp}&endTime=${toTimestamp}&interval=8h`

  console.log('Query URL: ' + url);

  let data

  try {
    const response = await fetch(url)
    data = await response.json()
  } catch (error) {
    console.error(error)
    return
  }

  console.log('Parsing data');

  rows = data.map(it => {
    return {
      from: moment(it[0]).format(DATE_FORMAT),
      to: moment(it[6]).format(DATE_FORMAT + 1),
      markPrice: it[1]
    }
  })

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(rows);

  fs.writeFile(filename, csv, (error) => {
    if (error) {
      console.error(error)
    }
  })

  console.log('File writen successfuly');

}

main()






