
var expect = require('expect.js');
import { createConnector } from '../src/index';


const add  = (a, b) => a * b;

describe('Cartiv index', function () {
  it('should expose createAPI', function () {
    expect(createConnector).to.be.a('function');
  });

  it('should do math', function () {
    expect(add(1, 3)).to.equal(4);
  });
});