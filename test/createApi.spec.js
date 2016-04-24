
import expect from 'expect.js';
import { createAPI } from '../src/index';
import reflux from 'reflux-core';


const add = (a, b) => a + b;

describe('Cartiv API', () => {
  it('should expose createAPI', () => {
    expect(createAPI).to.be.a('function');
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
      let actions = reflux.createActions(['first', 'second']);
      API.addAPIActions('apiName', actions);

      expect(API.apiName).to.be.an('object');
      expect(API.apiName.first).to.be.a('function');
      expect(API.apiName.second._isAction).to.be.ok();
    });

    it('should extend inner apis', () => {
      let actions = reflux.createActions(['first']);
      let secondActions = reflux.createActions(['second']);
      API.addAPIActions('apiName', actions);
      API.addAPIActions('apiName', secondActions);
      expect(API.apiName.first._isAction).to.be.ok();
      expect(API.apiName.second._isAction).to.be.ok();
    });
  });


  it('should do math', function () {
    expect(add(1, 3)).to.equal(4);
  });
});