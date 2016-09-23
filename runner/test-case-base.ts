/// <reference path="typings/index.d.ts" />

import {OutData} from './types';
import {SAMPLE_SIZE, SLEEP_TIME_MS} from './constants';
import {gatherNTmes} from './gather'

function generateCase(page: string, measureName: string, testName: string) {
  return function(
    outData:OutData,
    getTiming: (url: string, timingName: string) => Promise<number>): Promise<Array<number>> {
    return gatherNTmes(
      () => getTiming(page, measureName),
      SAMPLE_SIZE,
      SLEEP_TIME_MS).then(results => outData[testName] = (outData[testName] || []).concat(results));
  }
}

export {generateCase}
