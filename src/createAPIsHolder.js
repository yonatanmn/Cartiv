import {extend} from 'utils';

export default function createAPIsHolder() {

  function APIsHolder() {

  }

  function addAPIActions(apiName, actions) {
    //this[name] = Object.assign({}, this[name], actions);
    if (this[apiName]) {
      extend(this[apiName], actions);
    }
    else {
      this[apiName] = actions;
    }
  }


  APIsHolder.prototype.addAPIActions = addAPIActions;

  return new APIsHolder();
}
