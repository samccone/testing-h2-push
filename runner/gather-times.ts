/// <reference path="typings/index.d.ts" />

import printCSV from './to-csv-string';
import {gatherSimplePush, gatherNoSimplePush} from './simple-testcase';
import {getTiming} from './user-timing';
import {OutData} from './types';

const root:string = 'https://localhost:3000/static/';

let outData:OutData = {};

let boundGetTiming = (url: string, timingName: string) => getTiming(root, url, timingName)

gatherSimplePush(outData, boundGetTiming).then(() => {
  return gatherNoSimplePush(outData, boundGetTiming);
}).then(() => {
  return gatherNoSimplePush(outData, boundGetTiming);
}).then(() => {
  return gatherSimplePush(outData, boundGetTiming);
}).then(() => console.log(printCSV(outData))).catch(console.log.bind(console));
