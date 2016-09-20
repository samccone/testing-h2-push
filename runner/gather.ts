import {SAMPLE_SIZE, SLEEP_TIME_MS} from './constants';

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

export {gatherNTmes}
