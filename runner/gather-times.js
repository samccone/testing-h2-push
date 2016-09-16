const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');
const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'runner.json'), 'utf8'));
const root = 'https://localhost:3000/static/';
const SAMPLE_SIZE = 5;
const SLEEP_TIME_MS = 50;

function extractTimingDuration(name, timings) {
  return timings.extendedInfo.value.find(v => {
    return v.name === name}).duration;
}

function getTiming(url, timingName) {
  return lighthouse(`${root}/${url}`, {loadPage: true}, config).then((results) => {
    return extractTimingDuration(
        timingName,
        results.audits['user-timings']);
  }).catch(console.log.bind(console));
}

function gatherNTmes(
    gather,
    number,
    sleepBetween=SLEEP_TIME_MS,
    accumulator=[]) {

  return gather().then(v => {
    console.log(`run ${accumulator.length + 1} complete`);
    accumulator.push(v);

    if (accumulator.length < number) {
      return new Promise((res, rej) => {
       console.log(`sleeping for ${sleepBetween}ms`);
        setTimeout(() => {
          gatherNTmes(
              gather,
              number,
              sleepBetween,
              accumulator).then(res).catch(rej);
        }, sleepBetween);
      });
    } else {
      return accumulator;
    }
  })
}

let outData = {};

function gatherSimplePush() {
  return gatherNTmes(
    getTiming.bind(null, 'push-simple.html', 'time to run js'),
    SAMPLE_SIZE,
    SLEEP_TIME_MS).then(results => outData.pushSimple = results);
}

function gatherNoSimplePush() {
  return gatherNTmes(
      getTiming.bind(null, 'no-push-simple.html', 'time to run js'),
      SAMPLE_SIZE,
      SLEEP_TIME_MS).then(results => outData.noPushSimple = results);
}

gatherSimplePush().then(() => {
  return gatherNoSimplePush();
}).then(() => console.log(printCSV(outData))).catch(console.log.bind(console));

function valsAtIndex(obj, index) {
  return Object.keys(obj).reduce((accum, curr) => {
    accum.push(obj[curr][index]);
    return accum;
  }, []);
}

function printCSV(obj) {
  let headers = Object.keys(obj).join(',');

  // assume they all have the same length here..
  return headers + obj[Object.keys(obj)[0]].reduce((accum, curr, i) => {
    accum += `\n${valsAtIndex(obj, i).join(',')}`;
    return accum;
  }, '');
}
