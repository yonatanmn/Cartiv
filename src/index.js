import createStore from './createStore';
import createAPIsHolder from './createAPIsHolder';
import {
  connectMixin,
  createConnectDecorator,
  //connectDecoratorReactNative
  updateConnects
} from './componentConnectors';

import allowHMRinStore from './allowHMRinStore';
createStore.allowHMR = allowHMRinStore;


export {
  createAPIsHolder as createAPI,
  createStore,
  connectMixin as connect,
  createConnectDecorator as createConnector,
  updateConnects,
};

//connectDecoratorReactNatice as connectorNative
