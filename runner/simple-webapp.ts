/// <reference path="typings/index.d.ts" />
import {generateCase} from './test-case-base'

const push = generateCase('webapp-push.html', 'time to run app boot');
const noPush = generateCase('webapp.html', 'time to run app boot');

export {push, noPush}
