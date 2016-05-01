
import expect from 'expect.js';
import { createAPI, createActions } from '../src/index';

describe('Cartiv API', () => {
  it('Cartiv index should expose createAPI', () => {
    expect(createAPI).to.be.a('function');
  });

  it('Cartiv index should expose createActions', () => {
    expect(createActions).to.be.a('function');
  });

  describe('createActions', () => {
    it('should throw if no [string]||string actions', () => {
      expect(createActions).to.throwError();
      expect(createActions).withArgs('').to.throwError();
      expect(createActions).withArgs(['', {}]).to.throwError();
      expect(createActions).withArgs([undefined, '']).to.throwError();
      expect(createActions).withArgs({}).to.throwError();
      expect(createActions).withArgs(12).to.throwError();
    });

    it('should create action when string provided', () => {
      let actions = createActions('first');
      expect(actions.first).to.be.a('function');
      expect(actions.first._isAction).to.be.ok();
    });

    it('should create action when array of strings provided', () => {
      let actions = createActions(['first', 'second']);
      expect(actions.first._isAction).to.be.ok();
      expect(actions.second._isAction).to.be.ok();
    });
  });

  describe('addAPIActions', () => {
    let API;

    beforeEach(() => {
      API = createAPI();
    });

    it('should have addAPIActions method', () => {
      expect(API.addAPIActions).to.be.a('function');
    });

    it('should throws if no api name provided', () => {
      expect(API.addAPIActions).withArgs(undefined).to.throwError();
      expect(API.addAPIActions).withArgs('').to.throwError();
    });

    it('should store actions', () => {
      let actions = createActions(['first', 'second']);
      API.addAPIActions('apiName', actions);

      expect(API.apiName).to.be.an('object');
      expect(API.apiName.first).to.be.a('function');
      expect(API.apiName.second._isAction).to.be.ok();
    });

    it('should extend inner APIs', () => {
      let actions = createActions(['first']);
      let secondActions = createActions(['second']);
      API.addAPIActions('apiName', actions);
      API.addAPIActions('apiName', secondActions);
      expect(API.apiName.first._isAction).to.be.ok();
      expect(API.apiName.second._isAction).to.be.ok();
    });

    it('should store several APIs', () => {
      let actions = createActions(['a', 'b']);
      let secondActions = createActions(['c', 'd']);
      API.addAPIActions('apiName', actions);
      API.addAPIActions('secondApiName', secondActions);
      expect(API.apiName.a._isAction).to.be.ok();
      expect(API.secondApiName.c._isAction).to.be.ok();
      expect(API.secondApiName.b).to.be(undefined);
    });
  });
});