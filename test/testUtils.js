export function emptyFunction() { };
export function existsInArray(array, filterFn) {
  return array.filter(filterFn).length > 0;
}