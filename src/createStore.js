import reflux from 'reflux-core';
import storeMixin from './storeMixin';
import {extend, isFunction, isArray, startWithOn} from './utils';

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

  let {api, name, actions} = dispatcherConfig;

  //let storeApi = api[name] || {};

  let ActionStrs;

  if(isArray(actions)){
    ActionStrs = actions
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

  return reflux.createStore(storeDefinition);

}
