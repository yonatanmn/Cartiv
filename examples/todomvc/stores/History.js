import React, { Component, PropTypes } from 'react'
import todoStore from '../stores/todoStore';
import filterStore from '../stores/anotherStore';
import {connect} from 'cartiv';
//import {deepCompare} from './utils'
import equals from 'ramda/src/equals';
//import merge from 'ramda/src/merge';


import createHistoryComponent from './createHistoryComponent';
let HistoryCore = createHistoryComponent(React, [todoStore, filterStore]);

const History = React.createClass({
  getInitialState(){
    return {
      storesState: {}/*, history, storeHistories*/
    }
  },
  //mixins: stores.map((store)=>{
  //  return connect(store.cartivStore, null, store.name)
  //}),

  //history:[],
  ////historyIndex: 0,
  //storeHistories:{},

  componentDidUpdate (prevProps, prevState){
    //let hadRealChange = false;
    //stores.forEach(store => {
    //  if(store.cartivStore.__ON_HISTORY_CHANGE__){
    //    delete store.cartivStore.__ON_HISTORY_CHANGE__;
    //  } else if(!equals(prevState[store.name], this.state[store.name])){
    //    this.storeHistories[store.name] = this.storeHistories[store.name] || [];
    //    this.storeHistories[store.name].push(prevState[store.name]);
    //    hadRealChange = true;
    //  }
    //});
    //
    //if(hadRealChange){
    //  this.history.push(prevState);
    //  this.forceUpdate();
    //}
  },
  handleStoresUpdate(storesState, history, storeHistories){
    this.setState({storesState, history, storeHistories})
  },

  handleBackClick(){
    let prevHistory = this.history[this.history.length - 1];
    if (!prevHistory) {
      return;
    }

    console.log(prevHistory)
    //let prevStoreStates = Object.keys(prevHistory);
    stores.forEach(store=> {
      if (!equals(prevHistory[store.name], this.state[store.name])) {
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
  moveDirection(direction, store){
    //console.log(store)
    //if(direction === 'back'){
    //}
    this.core.move(direction, store);

  },
  //moveForward(store){
  //
  //},

  render() {


    function merge() {
      return Object.assign({}, ...arguments);
    }

    let {storesState, history, storeHistories} = this.state;

    let renderStorePosition = (history, specificStore) => {
      if (!history) {
        return <span/>
      }
      let index = history.index();
      let length = history.length();
      return (
        <div>
          {/*index > 1 &&*/ <span style={merge(backStyle)} onClick={this.moveDirection.bind(null, 'back', specificStore)}>back </span>}
          {index} / {length}
          {/*index < length &&*/ <span style={merge(backStyle)} onClick={this.moveDirection.bind(null, 'forward', specificStore)}> forward</span>}
        </div>
      )
    };

    return (
      <div style={merge(floatingStyle)}>
        {storeHistories && storeHistories.todo && storeHistories.todo.states &&
        storeHistories.todo.states.map((s)=> {
          return <div> {
            s.todos.map((t, i)=> {
              return <span key={i}>{t.text}</span>
            })
          }
          </div>
        })
        }
        {renderStorePosition(history)}
        {Object.keys(storesState).map((storeName, key)=> {
          return (
            <div key={key}>
              {renderStorePosition(storeHistories[storeName], storeName)}
              <div style={merge(boldStyle)}>{storeName} store</div>
              <div className="details">
                {Object.keys(storesState[storeName]).map((innerState, key) => {
                  let disp = JSON.stringify(storesState[storeName][innerState]);

                  function changeDisp(e) {
                    console.log(e.currentTarget.value)
                    //disp = e.currentTarget.value;
                  }

                  return (
                    <div key={key}>
                      <span>{innerState} : </span>
                      <input value={disp} onChange={changeDisp}/>
                    </div>

                  )
                })}
              </div>
            </div>
          )
        })}
        {console.log(history)}
        {history && history.states &&
        history.states.map((s)=> {
          return <div> {
            s.todo.todos.map((t, i)=> {
              return <span key={i}>{t.text}</span>
            })
          }
          </div>
        })
        }
        <HistoryCore onUpdate={this.handleStoresUpdate} ref={r=> this.core = r}/>
      </div>
    )
  }
});


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
  color: '#A2A2FF'
};
let boldStyle = {
  fontWeight: 900
};


export default History;

//const HistoryDisplay = React.createClass({
//
//  render(){
//    return (
//        <History/>
//    )
//  }
//});

//{JSON.stringify(this.state)}


/*   {this.history.length}
 {!!this.history.length && <span style={merge(backStyle)} onClick={this.handleBackClick}>BACK ALL</span>}
 {/!*JSON.stringify*!/Object.keys(this.state).map((storeName, key)=>{
 return (
 <div key={key}>
 {this.storeHistories[storeName] ? (<span className="history">{this.storeHistories[storeName].length}</span>) : 0}
 <div style={merge(boldStyle)}>{storeName} store</div>
 <div className="details">
 {Object.keys(this.state[storeName]).map((innerState, key) =>{
 let disp = JSON.stringify(this.state[storeName][innerState]);
 function changeDisp(e){
 console.log(e.currentTarget.value)
 disp = e.currentTarget.value;
 }
 return (
 <div key={key}>
 <span>{innerState} : </span>
 <input value={disp} onChange={changeDisp}/>
 </div>

 )
 })}
 </div>
 <HistoryCore onUpdate={this.handleStoresUpdate} stores={stores}/>
 </div>
 )
 })}*/