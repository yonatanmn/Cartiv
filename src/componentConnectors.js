import {object, isFunction} from './utils.js';
import {stateTriggers, componentRef} from './constants'


let setStateFunc = (componentInstance, newState) => {
  //let newState = noKey ? state : object([key], [state]);
  if (typeof componentInstance.isMounted === "undefined" || componentInstance.isMounted() === true) {
    componentInstance.setState(newState);
  }
};

let getInitialStateFunc = (noKey, store, key, componentName)=> {
  if (!isFunction(store.getInitialState)) {
    console.warn('component ' + componentName + ' is trying to connect to a store that lacks "getInitialState()" method');
    return {};
  } else {
    let storeState = store.state;
    //return noKey ? storeState : storeState[key];

    return noKey ? storeState : object([key], [storeState[key]]);
  }
};

let subscribe = (noKey, store, key, componentInstance)=> {
  let listener = noKey ? store : store[stateTriggers][key];

  this.unsubscribe = listener.listen((dataObj)=> {
    //store triggers storeState or storeState.key
    let newState = noKey ? dataObj : object([key], [dataObj]);
    setStateFunc(componentInstance, newState)
  });
};

let unSubscribe = ()=> {
  this.unsubscribe();
};

/**
 *
 * @param {object} store - Cartiv store to be connected to its state
 * @param {string} [key] - connect to a specific key in the state
 * @returns {object} - react-mixin
 */
export function connectMixin(store, key) {
  var noKey = key === undefined;

  return {
    getInitialState() {
      return getInitialStateFunc(noKey, store, key, this.constructor.displayName);
    },
    componentDidMount() {
      var componentInstance = this;
      subscribe.call(this, noKey, store, key, componentInstance);
    },
    componentWillUnmount(){
      unSubscribe.call(this);
    }
  }
}

/**
 *
 * @param React - react-native or react
 * @param {object} store - Cartiv store to be connected to its state
 * @param {string} [key] - connect to a specific key in the state
 * @returns {Function} - decorator function that receives a component to control its state;
 */
function connectDecorator (React, store, key) {
  let noKey = key === undefined;

  return function (Component) {
    //if no explicit state declaration in 'constructor'
    Component.prototype.state = {};

    return class ConnectorWrapper extends React.Component {

      componentDidMount() {
        let findInnerComponent = function (instance) {
          //recursively find inner most 'real react component', allowing multiple decorators
          if (instance.refs[componentRef]) {
            return findInnerComponent(instance.refs[componentRef]);
          }
          return instance;
        };

        let componentInstance = findInnerComponent(this.refs[componentRef]);

        let initialState = getInitialStateFunc(noKey, store, key, Component.name);
        setStateFunc(componentInstance, initialState);

        subscribe.call(this, noKey, store, key, componentInstance);

      }

      componentWillUnmount() { unSubscribe();  }

      render() {
        return (
            <Component
                ref={componentRef}
                {...this.props}
            />

        );
      }
    };
  };
}

import React from 'react';
import ReactNative from 'react-native';

export let connectDecoratorReact = connectDecorator.bind(null, React);
export let connectDecoratorReactNatice = connectDecorator.bind(null, ReactNative);

