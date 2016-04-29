
import expect from 'expect.js';
import { createStore, createAPI } from '../src/index';
import { emptyFunction } from './testUtils';

describe('Cartiv Store', () => {
  it('Cartiv index should expose createStore', () => {
    expect(createStore).to.be.a('function');
  });

  describe('handle dispatcher config', () => {
    it('should throw if proper api not provided', () => {
      expect(createStore).withArgs({ api: '' }, {}).to.throwError();
      expect(createStore).withArgs({ api: {} }, {}).to.throwError();
      expect(createStore).withArgs({ api: { a: 1 } }, {}).to.throwError();
      expect(createStore).withArgs({ api: [] }, {}).to.throwError();
      expect(createStore).withArgs({ api: () => {} }, {}).to.throwError();
    });

    it('should throw if proper name not provided', () => {
      expect(createStore).withArgs({ name: {} }, {}).to.throwError();
      expect(createStore).withArgs({ name: { a: 1 } }, {}).to.throwError();
      expect(createStore).withArgs({ name: [] }, {}).to.throwError();
      expect(createStore).withArgs({ name: () => {} }, {}).to.throwError();
    });

    it('should throw if proper actions not provided', () => {
      expect(createStore).withArgs({ actions: {} }, {}).to.throwError();
      expect(createStore).withArgs({ actions: { a: 1 } }, {}).to.throwError();
      expect(createStore).withArgs({ actions: [] }, {}).to.throwError();
      expect(createStore).withArgs({ actions: ['a', {}] }, {}).to.throwError();
    });
  });


  describe('handle store definition', () => {
    let api;
    let dispatcherConfig;
    beforeEach(() => {
      api = createAPI();
      dispatcherConfig = { api, name: 'name' };
    });

    it('should throw if not provided or not plain object', () => {
      expect(createStore).withArgs(dispatcherConfig, '').to.throwError();
      expect(createStore).withArgs(dispatcherConfig, () => {}).to.throwError();
      expect(createStore).withArgs(dispatcherConfig, []).to.throwError();
      expect(createStore).withArgs(dispatcherConfig, undefined).to.throwError();
      expect(createStore).withArgs(dispatcherConfig, null).to.throwError();
    });

    it('should throw if getInitialState is not a function', () => {
      expect(createStore).withArgs(dispatcherConfig, { getInitialState: [] }).to.throwError();
      expect(createStore).withArgs(dispatcherConfig, { getInitialState: {} }).to.throwError();
      expect(createStore).withArgs(dispatcherConfig, { getInitialState: '123' }).to.throwError();
    });
  });

  describe('created Store', () => {
    let api;
    let dispatcherConfig;
    let basicStoreDef = {
      getInitialState: emptyFunction,
      a: emptyFunction, b: emptyFunction,
      onActionA: emptyFunction, onActionB: emptyFunction
    };

    beforeEach(() => {
      api = createAPI();
      dispatcherConfig = { api, name: 'name' };
    });

    it('should create a store', () => {
      let store = createStore(dispatcherConfig, {});
      expect(store.constructor.name).to.eql('Store');
    });

    it('should subscribe to "onCapital" actions', () => {
      let store = createStore(dispatcherConfig, basicStoreDef);
      expect(store.subscriptions.length).to.eql(2);
      expect(store.subscriptions[0].listenable.actionName).to.eql('onActionA');
    });
    it('should subscribe to [string] actions', () => {
      dispatcherConfig.actions = ['a', 'b', 'c'];
      let store = createStore(dispatcherConfig, basicStoreDef);
      expect(store.subscriptions.length).to.eql(2);
      expect(store.subscriptions[0].listenable.actionName).to.eql('a');
    });
    it('should subscribe to filtered() actions', () => {
      dispatcherConfig.actions = (a) => {return a.includes('Action'); };
      let store = createStore(dispatcherConfig, basicStoreDef);
      expect(store.subscriptions.length).to.eql(2);
      expect(store.subscriptions[0].listenable.actionName).to.eql('onActionA');
    });
  });

  describe('state changes', () => {
    let api;
    let dispatcherConfig;
    let basicStoreDef = {
      //getInitialState() { return { a: 1 }; },
      //a: emptyFunction, b: emptyFunction,
      //onActionA: emptyFunction, onActionB: emptyFunction
    };

    beforeEach(() => {
      api = createAPI();
      dispatcherConfig = { api, name: 'name' };
    });

    it('should have state based on getInitialState', () => {
      basicStoreDef.getInitialState = () => { return { a: 1 }; };

      let store = createStore(dispatcherConfig, basicStoreDef);

      expect(store.state).to.eql({ a: 1 });
    });
  });
});

