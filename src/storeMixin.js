//var Reflux = require('reflux');
//var utils = require('./utils.js');
import Reflux from 'reflux-core';
import { extend, isFunction, setProp } from './utils.js';
import { stateTriggers } from './constants';

function attachAction(actionName) {
  this[stateTriggers] = this[stateTriggers] || {};
  if (this[stateTriggers][actionName]) {
    console.warn( //eslint-disable-line no-console
        `Not attaching event ${actionName}; key already exists`
    );
    return;
  }
  this[stateTriggers][actionName] = Reflux.createAction();
}


export default {
  setState(newState) {
    if (isFunction(this.shouldStoreUpdate) && !this.shouldStoreUpdate(newState)) {
      return;
    }

    let changed = false;
    let prevState = extend({}, this.state);

    for (let key in newState) {
      if (newState.hasOwnProperty(key)) {
        if (this.state[key] !== newState[key]) {
          this.state = setProp(this.state, newState, key);

          let triggerer = this[stateTriggers][key];
          if (!triggerer) { attachAction.call(this, key); }
          triggerer.trigger(newState[key]);
          changed = true;
        }
      }
    }

    if (changed) {
      if (isFunction(this.storeDidUpdate)) {
        this.storeDidUpdate(prevState);
      }

      this.trigger(this.state);
    }
  },

  init() {
    if (isFunction(this.getInitialState)) {
      this.state = this.getInitialState();
      for (let key in this.state) {
        if (this.state.hasOwnProperty(key)) {
          attachAction.call(this, key);
        }
      }
    }
  }
};

