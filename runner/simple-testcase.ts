/// <reference path="typings/index.d.ts" />
import {generateCase} from './test-case-base'

const push = generateCase('push-simple.html', 'time to run js', 'simple w/ push');
const noPush = generateCase('no-push-simple.html', 'time to run js', 'simple w/o push');

export {push, noPush}
