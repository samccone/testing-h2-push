/// <reference path="typings/index.d.ts" />
import {generateCase} from './test-case-base'

const push = generateCase('webapp-push.html', 'time to run app boot', 'webapp w/ push');
const noPush = generateCase('webapp.html', 'time to run app boot', 'webapp w/o push');

export {push, noPush}
