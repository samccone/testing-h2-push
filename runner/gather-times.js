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

gatherNTmes(
    getTiming.bind(null, 'push-simple.html', 'time to run js'),
    SAMPLE_SIZE,
    SLEEP_TIME_MS).then((results) => {
  console.log(results);
});
