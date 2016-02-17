'use strict';

import createStore from './createStore';
import createAPIsHolder from './createAPIsHolder';
import {
    connectMixin,
    createConnectDecorator,
    //connectDecoratorReactNatice
} from './componentConnectors';



export {
    createAPIsHolder as createAPI,
    createStore,
    connectMixin as connect,
    createConnectDecorator as createConnector,
    //connectDecoratorReactNatice as connectorNative
}

