import reflux from 'reflux-core';
import { isArray, isString } from './utils';

export default function createActions(actionNames) {
  if (isString(actionNames)) {
    if (actionNames === '') { throw new Error('Please mention action names'); }
    actionNames = [actionNames];
  }

  if (!isArray(actionNames) || !actionNames.every(isString)) {
    throw new Error('Please mention action names as array of strings or single action as a string');
  }
  return reflux.createActions(actionNames);
}

