
import expect from 'expect.js';
import { createStore, createAPI } from '../src/index';

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
    //
    //it('should throw if proper actions not provided', () => {
    //  expect(createStore).withArgs({ actions: {} }, {}).to.throwError();
    //  expect(createStore).withArgs({ actions: { a: 1 } }, {}).to.throwError();
    //  expect(createStore).withArgs({ actions: [] }, {}).to.throwError();
    //  expect(createStore).withArgs({ actions: ['a', {}] }, {}).to.throwError();
    //});
  });



});
