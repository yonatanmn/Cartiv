import React, { Component, PropTypes } from 'react'
import todoStore from '../stores/todoStore';
import filterStore from '../stores/anotherStore';
import {connect} from 'cartiv';
import {deepCompare} from './utils'

const NAME = '__CARTIV_STORE_NAME__';

let stores = [todoStore, filterStore].map(store => {
  return {
    cartivStore: store,
    name: store[NAME]
  }
});
//[
//
//  connect(todoStore, null, 'todoStore'),
//  connect(filterStore, null, 'filterStore')
//]
const History = React.createClass({
  mixins: stores.map((store)=>{
    return connect(store.cartivStore, null, store.name)
  }),

  history:[],
  //historyIndex: 0,
  storeHistories:{},

  componentDidUpdate (prevProps, prevState){
    let hadRealChange = false;
    stores.forEach(store => {
      if(store.cartivStore.__ON_HISTORY_CHANGE__){
        delete store.cartivStore.__ON_HISTORY_CHANGE__;
      } else if(!deepCompare(prevState[store.name], this.state[store.name])){
        this.storeHistories[store.name] = this.storeHistories[store.name] || [];
        this.storeHistories[store.name].push(prevState[store.name]);
        hadRealChange = true;
      }
    });

    //Object.keys(prevState).forEach(storeName => {
    //  if(prevState[storeName] !== this.state[storeName]){
    //    this.storeHistories[storeName] = this.storeHistories[storeName] || [];
    //    this.storeHistories[storeName].push(prevState[storeName])
    //  }
    //});
    if(hadRealChange){
      //console.log('push' + Date.now());
      this.history.push(prevState);
      this.forceUpdate();
      //this.historyIndex++;
    }
  },

  handleBackClick(){
    let prevHistory = this.history[this.history.length - 1];
    if(!prevHistory){return; }

    console.log(prevHistory)
    //let prevStoreStates = Object.keys(prevHistory);
    stores.forEach(store=>{
      if(!deepCompare(prevHistory[store.name], this.state[store.name])){
        store.cartivStore.setState(prevHistory[store.name]);
        store.cartivStore.__ON_HISTORY_CHANGE__ = true;
        this.storeHistories[store.name].pop();
      }
    });
    this.history.pop();
    this.forceUpdate()

  },
  handleStoreBackClick(store){

  },

  render() {
    let floatingStyle = {
      position: 'fixed',
      top: 10,
      left: 10,
      background: '#000000',
      color: '#ffffff',
      borderWidth: '1',
      borderColor: '#ff0000'
    };
    let backStyle = {
      color: '#0000ff'
    };
    let boldStyle={
      fontWeight: 900
    };
    function merge(){
      return Object.assign({}, ...arguments);
    }

    return (
      <div style={merge(floatingStyle)}>
        {this.history.length}
        {!!this.history.length && <span style={merge(backStyle)} onClick={this.handleBackClick}>BACK ALL</span>}
        {/*JSON.stringify*/Object.keys(this.state).map((storeName, key)=>{
          return (
              <div key={key}>
                {this.storeHistories[storeName] ? (<span className="history">{this.storeHistories[storeName].length}</span>) : 0}
                <div style={merge(boldStyle)}>{storeName} store</div>
                <div className="details">
                  {Object.keys(this.state[storeName]).map((innerState, key) =>{
                    return (
                        <div key={key}>
                          <span>{innerState} : </span>
                          <span>{JSON.stringify(this.state[storeName][innerState])}</span>
                        </div>

                    )
                  })}
                </div>

              </div>)
        })}



      </div>
    )
  }
});

export default History;

const HistoryDisplay = React.createClass({

  render(){
    return (
        <History/>
    )
  }
});

//{JSON.stringify(this.state)}
