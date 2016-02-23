import {connect} from 'cartiv';
const NAME = '__CARTIV_STORE_NAME__';
import equals from 'ramda/src/equals';


export default function createHistoryComponent(React, stores) {
  stores = stores.map(store => {
    return {
      cartivStore: store,
      name: store[NAME]
    }
  });

  class History{
    constructor(initialState) {
      this.i = 1;
      this.states = [initialState];
    }
    get(counter = 0){

      return this.states[this.i - 1 + counter];
    }
    index(){
      return this.i ;
    }
    length(){
      return this.states.length ;
    }
    push(state){
      this.states = this.states.slice(0, this.i).concat([state]);
      this.i++;
    }
    back(){
      this.i = Math.max(1, this.i - 1)
    }
    forward(){
      this.i = Math.min(this.states.length, this.i + 1)
    }

  }


  return React.createClass({
    mixins: stores.map((store)=> {
      return connect(store.cartivStore, null, store.name)
    }),

    componentWillMount(){
      this.history = new History(this.state);
      this.storeHistories = stores.reduce((obj, store) => {
        obj[store.name] = new History(this.state[store.name]);
        return obj;
      }, {});
      //console.log(this.storeHistories)
    },

    updateDisplay(){
      this.props.onUpdate(this.state, this.history, this.storeHistories);
    },

    componentDidMount(){
      this.updateDisplay();
    },

    move(direction, storeName){
      let isBack = direction === 'back';
      let directionMethod = isBack ? 'back' : 'forward';
      let distance = isBack ? -1 : 1;

      let hadRealChange = false;

      let setStoreState = (historyState, store)=>{
        if (!equals(historyState, this.state[store.name])) {
          store.cartivStore.setState(historyState);
          store.cartivStore.__ON_HISTORY_CHANGE__ = true;
          this.storeHistories[store.name][directionMethod]();
          hadRealChange = true;
        }
      };

      if(storeName){
        let historyState = this.storeHistories[storeName].get(distance);
        if(historyState){    let store = stores.filter(s => {return s.name === storeName})[0];
          setStoreState(historyState, store); }



      } else {
        let historyState = this.history.get(distance);
        if(historyState) {
          stores.forEach(store=> {
            setStoreState(historyState[store.name], store);


            //if (!equals(historyState[store.name], this.state[store.name])) {
            //  store.cartivStore.setState(historyState[store.name]);
            //  store.cartivStore.__ON_HISTORY_CHANGE__ = true;
            //  this.storeHistories[store.name][directionMethod]();
            //  hadRealChange = true;
            //}
          });
        }
      }



      console.log(hadRealChange)
      if (hadRealChange) {
        this.history[directionMethod]();
        this.updateDisplay();
      }

    },

    componentDidUpdate (prevProps, prevState){
      //if(prevState === this.state){
      //  return;
      //}
      let hadRealChange = false;
      stores.forEach(store => {
        if (store.cartivStore.__ON_HISTORY_CHANGE__) {
          delete store.cartivStore.__ON_HISTORY_CHANGE__;
        } else if (!equals(prevState[store.name], this.state[store.name])) {
          //this.storeHistories[store.name] = this.storeHistories[store.name] || [];
          this.storeHistories[store.name].push(this.state[store.name]);
          hadRealChange = true;
        }
      });

      if (hadRealChange) {
        this.history.push(this.state);
        this.updateDisplay();
      }
    },

    render(){
      return <span></span>;
    }
  });
}