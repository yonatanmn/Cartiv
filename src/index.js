import createStore from './createStore';
import createAPIsHolder from './createAPIsHolder';
import createActions from './createActions';
import {
    connectMixin,
    createConnectDecorator,
    //connectDecoratorReactNative
} from './componentConnectors';

import allowHMRinStore from './allowHMRinStore';
createStore.allowHMR = allowHMRinStore;


export {
    createAPIsHolder as createAPI,
    createActions,
    createStore,
    connectMixin as connect,
    createConnectDecorator as createConnector,
    //connectDecoratorReactNatice as connectorNative
};

