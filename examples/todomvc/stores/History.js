import React, { Component, PropTypes } from 'react'
import todoStore from '../stores/todoStore';
import filterStore from '../stores/anotherStore';
import {connect} from 'cartiv';

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
      } else if(prevState[store.name] !== this.state[store.name]){
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
      this.history.push(prevState);
      //this.historyIndex++;
    }
  },

  handleBackClick(){
    let prevHistory = this.history[this.history.length - 1];

    console.log(prevHistory)
    //let prevStoreStates = Object.keys(prevHistory);
    stores.forEach(store=>{
      if(prevHistory[store.name] !== this.state[store.name]){
        store.cartivStore.setState(prevHistory[store.name]);
        store.cartivStore.__ON_HISTORY_CHANGE__ = true;
        this.storeHistories[store.name].pop();
      }
    });
    this.history.pop();


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
    return (
      <div style={Object.assign({}, floatingStyle)}>
        <div style={Object.assign({}, backStyle)} onClick={this.handleBackClick}>BACK ALL</div>
        {JSON.stringify(this.state)}



      </div>
    )
  }
});

export default History;

//{JSON.stringify(this.state)}
