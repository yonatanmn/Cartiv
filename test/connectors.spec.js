/* eslint-disable no-multi-comp */

import expect from 'expect.js';
import { createAPI, createActions, createStore, connect, createConnector } from '../src/index';
import { componentRef } from '../src/constants';
import React, { Component } from 'react';
let connectDecorator = createConnector(React);
import ReactTestUtils from 'react-addons-test-utils';
import testDOM from './testDOM';
testDOM('<html><body></body></html>');


//let connector = createConnector(React);

describe('Component connectors', () => {
  let componentEs5;
  let componentEs6;
  let api = createAPI();

  let store;

  beforeEach(() => {
    store = createStore({ api, name: 'name' }, {
      getInitialState() { return { a: 1, b: 'b', c: 3 }; },
      //onActionA() {
      //  this.setState({ a: 2, b: 1 });
      //}
    });
    let ComponentClassEs5 = React.createClass({
      mixins: [connect(store)],
      getInitiaState() {return {}; },
      render() {
        return <div/>;
      }
    });

    @connectDecorator(store)
    class ComponentClassEs6 extends Component {
      render() {
        return <div/>;
      }
    }

    componentEs5 = ReactTestUtils.renderIntoDocument(<ComponentClassEs5/>);
    componentEs6 = ReactTestUtils.renderIntoDocument(<ComponentClassEs6/>).refs[componentRef];
  });

  it("should connect to the store's initial state", () => {
    expect(componentEs5.state.a).to.eql(1);
    expect(componentEs6.state.a).to.eql(1);
  });
  it('should have state of store after store.setState()', () => {
    store.setState({ b: 2 });
    expect(componentEs5.state.a).to.eql(1);
    expect(componentEs5.state.b).to.eql(2);

    expect(componentEs6.state.a).to.eql(1);
    expect(componentEs6.state.b).to.eql(2);
  });
});
