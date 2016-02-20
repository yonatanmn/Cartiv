import {zipObj, isFunction, isString, putInArrayIfNotAlready} from './utils.js';
import {stateTriggers, componentRef, unsubscribers} from './constants'

function keyValFromObjOrString(objOrStr){
  return isString(objOrStr)
    ? {key: objOrStr, val: objOrStr}
    : {key: Object.keys(objOrStr)[0], val: Object.values(objOrStr)[0]}
}
let keyFromObjOrString = key => {return keyValFromObjOrString(key).key};
let valFromObjOrString = key => {return keyValFromObjOrString(key).val};

/**
 *
 * @param state
 * @param stateProperty
 * @returns {object}
 */
function putStateInStateProperty(state, stateProperty){
  return !stateProperty ? state : {[stateProperty] : state}
}


let setStateFunc = (componentInstance, newState, stateProperty) => {
  //let newState = noKey ? state : zipObj([key], [state]);
  //if (typeof componentInstance.isMounted === "undefined" || componentInstance.isMounted() === true) {
    componentInstance.setState(putStateInStateProperty(newState, stateProperty));
  //}
};

let getInitialStateFunc = (store, keys, componentName)=> {
  if (!isFunction(store.getInitialState)) {
    console.warn('component ' + componentName + ' is trying to connect to a store that lacks "getInitialState()" method');
    return {};
  } else {
    let storeState = store.state;
    //return noKey ? storeState : storeState[key];
    if(!keys){
      return storeState;
    } else {
      keys = putInArrayIfNotAlready(keys);

      return zipObj(
        keys.map(valFromObjOrString),
        keys.map(key => {return storeState[keyFromObjOrString(key)]})
      );
    }

    //return !keys ? storeState : zipObj(keys, keys.map(key => {return storeState[key]}));
  }
};

let subscribe = (_this, store, keys, componentInstance, stateProperty, displayName)=> {
  let listeners;

  if(!keys){
    listeners = [{triggerer: store}];
  } else {
    keys = putInArrayIfNotAlready(keys);
    listeners = keys.map(
      key => {
        let triggerer = store[stateTriggers][keyFromObjOrString(key)];
        if(!triggerer) {
          console.warn(displayName + ' is trying to connect to store which was not initialized with: ' + key)
        }
        return {
          triggerer,
          key: valFromObjOrString(key)
        };
      })
  }

  _this[unsubscribers] = [];

  listeners.forEach(listener=>{
    if(!listener.triggerer){return; }
    _this[unsubscribers].push(
      listener.triggerer.listen((dataObj)=> {
        let newState = !listener.key
          ? dataObj
          : {[listener.key] : dataObj};

        setStateFunc(componentInstance, newState, stateProperty)
      })
    );
  });


  //let listener = noKey ? store : store[stateTriggers][key];

  //_this[unsubscribers] = listener.listen((dataObj)=> {
  //  //store triggers storeState or storeState.key
  //  let newState = noKey ? dataObj : zipObj([key], [dataObj]);
  //  setStateFunc(componentInstance, newState)
  //});
};


let unSubscribe = (_this)=> {
  _this[unsubscribers].forEach(unsubscriber=>{
    unsubscriber();
  });
};



/**
 *
 * @param {object} store - Cartiv store to be connected to its state
 * @param {{k:v}|string|[{k:v}|string]} keys - connect to a specific key in the state
 *  pass string - key in the store, rename it with object - {storeKey: newName}, or send a list of those
 * @param {string} stateProperty - set the store's state 
 * @returns {object} - react-mixin
 */
export function connectMixin(store, keys, stateProperty) {

  //let noKey = !keys;
  //let noStateProperty = !stateProperty;

  return {
    getInitialState() {
      let initialState = getInitialStateFunc(store, keys, this.constructor.displayName);
      return putStateInStateProperty(initialState ,stateProperty)
    },
    componentDidMount() {
      var componentInstance = this;
      subscribe(this, store, keys, componentInstance, stateProperty, this.constructor.displayName);
    },
    componentWillUnmount(){
      unSubscribe(this);
    }
  }
}

/**
 *
 * @param React - react-native or react
 * @param {object} store - Cartiv store to be connected to its state
 * @param {{k:v}|string|[{k:v}|string]} keys - connect to a specific key in the state
 *  pass string - key in the store, rename it with object - {storeKey: newName}, or send a list of those
 * @param {string} stateProperty - set the store's state  * @returns {Function} - decorator function that receives a component to control its state;
 */
function connectDecorator (React, store, keys, stateProperty) {

  return function (Component) {
    //if no explicit state declaration in 'constructor'
    Component.prototype.state = {};

    return class ConnectorWrapper extends React.Component {

      componentDidMount = ()=>{
        let findInnerComponent = function (instance) {
          //recursively find inner most 'real react component', allowing multiple decorators
          if (instance.refs[componentRef]) {
            return findInnerComponent(instance.refs[componentRef]);
          }
          return instance;
        };

        let componentInstance = findInnerComponent(this.refs[componentRef]);

        let initialState = getInitialStateFunc(store, keys, Component.name);
        setStateFunc(componentInstance, initialState, stateProperty);

        subscribe(this, store, keys, componentInstance, stateProperty, componentInstance.constructor.name);

      };

      componentWillUnmount = ()=>{ unSubscribe(this);  };

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

//import React from 'react';
//import ReactNative from 'react-native';
export function createConnectDecorator(React){
  return connectDecorator.bind(null, React)
}
//export let connectDecoratorReact = connectDecorator.bind(null, React);
//export let connectDecoratorReactNatice = connectDecorator.bind(null, ReactNative);

