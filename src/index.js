'use strict';

import createStore from './createStore';
import createAPIsHolder from './createAPIsHolder';
import {
    connectMixin,
    createConnectDecorator,
    //connectDecoratorReactNative
} from './componentConnectors';

import allowHMRinStore from './allowHMRinStore'
createStore.allowHMR = allowHMRinStore;


export {
    createAPIsHolder as createAPI,
    createStore,
    connectMixin as connect,
    createConnectDecorator as createConnector,
    //connectDecoratorReactNatice as connectorNative
}

