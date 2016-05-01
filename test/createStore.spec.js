
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

  describe('created Store and subscriptions', () => {
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

    it('should listen to actions', (done) => {
      basicStoreDef.onActionA = () => { done(); };
      /*let store = */createStore(dispatcherConfig, basicStoreDef);
      api.name.onActionA();
    });
  });

  describe('state changes', () => {
    let api = createAPI();
    let dispatcherConfig = { api, name: 'name' };
    let store;
    let basicStoreDef = {
      getInitialState() { return { a: 1, b: 'b', c: { d: 'c.d' } }; },
    };

    beforeEach(() => {
      store = createStore(dispatcherConfig, basicStoreDef);
    });

    it('should have state based on getInitialState', () => {
      expect(store.state.a).to.eql(1);
    });

    it('should change state based on setState', () => {
      store.setState({ a: 2 });
      expect(store.state.a).to.eql(2);
      expect(store.state.b).to.eql('b');
      store.setState({ c: { e: 'c.e' } });
      expect(store.state.c.d).to.be(undefined);
      expect(store.state.c.e).to.eql('c.e');
    });
  });

  describe('storeDidUpdate, shouldStoreUpdate', () => {
    let api;// = createAPI();
    let dispatcherConfig;// = { api, name: 'name' };
    let store;
    let basicStoreDef;

    beforeEach(() => {
      api = createAPI();
      dispatcherConfig = { api, name: 'name' };
      basicStoreDef = {
        getInitialState() {
          return { a: 1 };
        },
      };
    });

    it('should call storeDidUpdate after setState', (done) => {
      basicStoreDef.storeDidUpdate = (prevState) => {
        expect(prevState.a).to.eql(1);
        expect(store.state.a).to.eql(2);
        done();
      };
      store = createStore(dispatcherConfig, basicStoreDef);
      store.setState({ a: 2 });
    });

    it('should prevent state change if shouldStoreUpdate returns false', () => {
      basicStoreDef.shouldStoreUpdate = (newState) => {
        return newState.a !== 2;
      };
      store = createStore(dispatcherConfig, basicStoreDef);
      store.setState({ a: 2 });
      expect(store.state.a).to.eql(1);
    });

    it('should not prevent state change if shouldStoreUpdate returns true', () => {
      basicStoreDef.shouldStoreUpdate = (newState) => {
        return newState.a === 2;
      };
      store = createStore(dispatcherConfig, basicStoreDef);
      store.setState({ a: 2 });
      expect(store.state.a).to.eql(2);
    });
  });

  it('should work, full flow - action to state', (done) => {
    let api = createAPI();
    let dispatcherConfig = { api, name: 'name' };
    let basicStoreDef = {
      getInitialState() { return { a: 1, b: 'b', c: 3 }; },
      onActionA() {
        this.setState({ a: 2, b: 1 });
      }
    };

    let store = createStore(dispatcherConfig, basicStoreDef);

    expect(store.state).to.eql({ a: 1, b: 'b', c: 3 });
    api.name.onActionA();
    setTimeout(() => {
      expect(store.state).to.eql({ a: 2, b: 1, c: 3 });
      done();
    }, 1);
  });
});

