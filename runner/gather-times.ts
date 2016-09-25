/// <reference path="typings/index.d.ts" />

import printCSV from './to-csv-string';
import * as simple from './simple-testcase';
import *  as simpleWebapp from './simple-webapp';

import {getTiming} from './user-timing';
import {OutData} from './types';

const root:string = 'https://localhost/pages/';

let outData:OutData = {};

let boundGetTiming = (url: string, timingName: string) => getTiming(root, url, timingName);
let boundSimplePush = () => simpleWebapp.push(outData, boundGetTiming);
let boundNoSimplePush = () =>simpleWebapp.noPush(outData, boundGetTiming);

function chainGather(...promises: Array<() => Promise<any>>):Promise<any> {
  return Array.from(arguments).reduce((prev, curr) => {
    return prev.then(() => curr())
  }, Promise.resolve());
}

chainGather(
  boundSimplePush,
  boundNoSimplePush,
  boundNoSimplePush,
  boundSimplePush
).then(() => {
  console.log(printCSV(outData));
}).catch(console.log.bind(console));
