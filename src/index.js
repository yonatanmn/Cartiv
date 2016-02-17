'use strict';

import createStore from './createStore';
import createAPIsHolder from './createAPIsHolder';
import {
    connectMixin,
    connectDecoratorReact,
    //connectDecoratorReactNatice
} from './componentConnectors';



export {
    createAPIsHolder as createAPI,
    createStore,
    connectMixin as connect,
    connectDecoratorReact as connector,
    //connectDecoratorReactNatice as connectorNative
}

