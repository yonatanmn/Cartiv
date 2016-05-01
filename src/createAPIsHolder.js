import { extend } from './utils';

export default function createAPIsHolder() {
  function APIsHolder() {}

  function addAPIActions(apiName, actions) {
    if (typeof apiName !== 'string' || !apiName) { throw new Error('Please mention api name'); }
    if (this[apiName]) {
      extend(this[apiName], actions);
    } else {
      this[apiName] = actions;
    }
  }


  APIsHolder.prototype.addAPIActions = addAPIActions;

  return new APIsHolder();
}
