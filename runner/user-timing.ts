/// <reference path="typings/index.d.ts" />

const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

import {Timings, OutData} from './types';

const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'runner.json'), 'utf8'));

function extractTimingDuration(name: string, timings: Timings): number {
  return (timings.extendedInfo.value as any).find(v => {
    return v.name === name}).duration;
}

function getTiming(root: string,
                   url: string,
                   timingName: string): Promise<number> {
  return lighthouse(`${root}/${url}`, {loadPage: true}, config).then((results) => {
    return extractTimingDuration(
        timingName,
        results.audits['user-timings']);
  }).catch(console.log.bind(console));
}

export {getTiming}
