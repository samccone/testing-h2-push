/// <reference path="typings/index.d.ts" />

import {OutData} from './types';
import {SAMPLE_SIZE, SLEEP_TIME_MS} from './constants';
import {gatherNTmes} from './gather'

function gatherSimplePush(outData:OutData, getTiming): Promise<Array<number>> {
  return gatherNTmes(
    () => getTiming('push-simple.html', 'time to run js'),
    SAMPLE_SIZE,
    SLEEP_TIME_MS).then(results => outData.pushSimple = (outData.pushSimple || []).concat(results));
}

function gatherNoSimplePush(outData:OutData, getTiming): Promise<Array<number>> {
  return gatherNTmes(
    () => getTiming('no-push-simple.html', 'time to run js'),
    SAMPLE_SIZE,
    SLEEP_TIME_MS).then(results => outData.noPushSimple = (outData.noPushSimple || []).concat(results));
}

export {gatherSimplePush, gatherNoSimplePush}
