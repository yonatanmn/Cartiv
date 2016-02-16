//var Reflux = require('reflux');
//var utils = require('./utils.js');
import Reflux from 'reflux-core';
import {extend, isFunction, setProp} from './utils.js';
import {stateTriggers} from './constants'

function attachAction(actionName) {
  this[stateTriggers] = this[stateTriggers] || {};
  if (this[stateTriggers][actionName]) {
    console.warn(
        'Not attaching event ' + actionName + '; key already exists'
    );
    return;
  }
  this[stateTriggers][actionName] = Reflux.createAction();
}


export default {
  setState: function (newState) {

    if (isFunction(this.shouldStoreUpdate) && !this.shouldStoreUpdate(newState)) {
      return;
    }

    var changed = false;
    var prevState = extend({}, this.state);

    for (var key in newState) {
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

  init: function () {
    if (isFunction(this.getInitialState)) {
      this.state = this.getInitialState();
      for (var key in this.state) {
        if (this.state.hasOwnProperty(key)) {
          attachAction.call(this, key);
        }
      }
    }
  }
};