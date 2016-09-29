import reflux from 'reflux-core';
import { isString, isArrayOfStrings } from './utils';

export default function createActions(actionNames, options) {
  options = options || {};
  if (isString(actionNames)) {
    if (actionNames === '') {
      throw new Error('Please mention action names');
    }
    actionNames = [actionNames];
  } else if (!isArrayOfStrings(actionNames)) {
    throw new Error('Please mention action names as array of strings or single action as a string');
  }

  let actions = {};
  actionNames.forEach((name) => {
    actions[name] = reflux.createAction({ ...options, actionName: name });
  });
  return actions;
}
