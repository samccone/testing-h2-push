function valsAtIndex(obj: Object, index: number): Array<any> {
  return Object.keys(obj).reduce((accum, curr) => {
    accum.push(obj[curr][index]);
    return accum;
  }, []);
}

export default function(obj: Object): string {
  let headers = Object.keys(obj).join(',');

  // assume they all have the same length here..
  return headers + obj[Object.keys(obj)[0]].reduce((accum, curr, i) => {
    accum += `\n${valsAtIndex(obj, i).join(',')}`;
    return accum;
  }, '');
}
