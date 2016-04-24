import reflux from 'reflux-core';
import storeMixin from './storeMixin';
import { isFunction, isArray, startWithOn, isString, isObject, isArrayOfStrings } from './utils';
import { storeName } from './constants';
/***
 *
 * @param {object} dispatcherConfig
 * @param {APIsHolder} dispatcherConfig.api - relevant APIs holder
 *
 * @param {string} dispatcherConfig.name - this store API, to be called with API.storeName.onChangeSomething
 *
 * @param {function|[string]} [dispatcherConfig.actions = startWithOn] - list of action names,
 * or a function to filter store's methods to select which will
 * become part of the API (defaulted to get methods starts with "on"+Capital like: `onSomething`)
 *
 * @param {object} storeDefinition - object containing store methods
 * @param {function} storeDefinition.getInitialState - function that returns the initial state
 * @returns {object}
 */
export default function create(dispatcherConfig, storeDefinition) {
  let { api, name, actions } = dispatcherConfig;

  if (!isObject(api) || !isFunction(api.addAPIActions) /*|| !(api instanceof 'APIsHolder')*/) {
    throw new Error('dispatcherConfig.api should be an API object');
  }
  if (!isString(name)) {
    throw new Error('dispatcherConfig.name should be a string');
  }
  if (actions && !isFunction(actions) && !isArrayOfStrings(actions)) {
    throw new Error('dispatcherConfig.name should be a string');
  }
  if (!isObject(storeDefinition)) {
    throw new Error('store definition is not plain object');
  }
  if (storeDefinition.getInitialState && !isFunction(storeDefinition.getInitialState)) {
    throw new Error('getInitialState is not a function');
  }

  let ActionStrs;

  if (isArray(actions)) {
    ActionStrs = actions;
  } else {
    let filterFunc = isFunction(actions) ? actions : startWithOn;
    ActionStrs = Object.keys(storeDefinition).filter(filterFunc);
  }

  let storeActions = reflux.createActions(ActionStrs);
  api.addAPIActions(name, storeActions);

  //extend(api[name], storeActions);
  //api[name] = reflux.createActions(ActionStrs);

  storeDefinition.mixins = [storeMixin];
  storeDefinition.listenables = api[name];
  storeDefinition[storeName] = name;

  return reflux.createStore(storeDefinition);
}

