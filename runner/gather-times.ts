/// <reference path="typings/index.d.ts" />

const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'runner.json'), 'utf8'));
const root:string = 'https://localhost:3000/static/';
const SAMPLE_SIZE: number = 9;
const SLEEP_TIME_MS: number = 50;

function extractTimingDuration(name: string, timings: {extendedInfo: {value: Array<{name: string, duration: number}>}}): number {
  return timings.extendedInfo.value.find(v => {
    return v.name === name}).duration;
}

function getTiming(url: string, timingName: string): Promise<number> {
  return lighthouse(`${root}/${url}`, {loadPage: true}, config).then((results) => {
    return extractTimingDuration(
        timingName,
        results.audits['user-timings']);
  }).catch(console.log.bind(console));
}

function gatherNTmes(
    gather: () => Promise<number>,
    number,
    sleepBetween=SLEEP_TIME_MS,
    accumulator=[]): Promise<Array<number>> {

  return gather().then((v) => {
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

let outData:{noPushSimple?: Array<number>, pushSimple?: Array<number>} = {};

function gatherSimplePush(): Promise<Array<number>> {
  return gatherNTmes(
    () => getTiming('push-simple.html', 'time to run js'),
    SAMPLE_SIZE,
    SLEEP_TIME_MS).then(results => outData.pushSimple = (outData.pushSimple || []).concat(results));
}

function gatherNoSimplePush(): Promise<Array<number>> {
  return gatherNTmes(
      () => getTiming('no-push-simple.html', 'time to run js'),
      SAMPLE_SIZE,
      SLEEP_TIME_MS).then(results => outData.noPushSimple = (outData.noPushSimple || []).concat(results));
}

gatherSimplePush().then(() => {
  return gatherNoSimplePush();
}).then(() => {
  return gatherNoSimplePush();
}).then(() => {
  return gatherSimplePush();
}).then(() => console.log(printCSV(outData))).catch(console.log.bind(console));

function valsAtIndex(obj: Object, index: number): Array<any> {
  return Object.keys(obj).reduce((accum, curr) => {
    accum.push(obj[curr][index]);
    return accum;
  }, []);
}

function printCSV(obj: Object): string {
  let headers = Object.keys(obj).join(',');

  // assume they all have the same length here..
  return headers + obj[Object.keys(obj)[0]].reduce((accum, curr, i) => {
    accum += `\n${valsAtIndex(obj, i).join(',')}`;
    return accum;
  }, '');
}
