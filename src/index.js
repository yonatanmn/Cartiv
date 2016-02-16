'use strict';

import createStore from './createStore';
import {
    connectMixin,
    connectDecoratorReact,
    connectDecoratorReactNatice
} from './componentConnectors';



export {
    createStore,
    connectMixin as connect,
    connectDecoratorReact as connector,
    connectDecoratorReactNatice as connectorNative
}

