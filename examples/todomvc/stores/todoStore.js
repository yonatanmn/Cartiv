import {createStore} from 'cartiv';
import api from './Api';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'


let store = createStore({api, name: 'todo'}, {
  getInitialState(){
    return {
      filter: SHOW_ALL,
      completedCount: 0,
      todos: [{
        text: 'Use Casrsssv!',
        completed: false,
        id: 0
      }]
    }
  },

  onAdd(text){
    console.log('s')
    this.setState({
      todos: [
        {
          id: this.state.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text
        }, ...this.state.todos]
    });
  },

  onChangeFilter(filter){
    this.setState({filter})
  },

  onDelete(id){
    this.setState({
      todos: this.state.todos.filter(todo =>
        todo.id !== id
      )
    })
  },

  onEdit(id, text){
    this.setState({
      todos: this.state.todos.map(todo =>
        todo.id === id ?
          Object.assign({}, todo, {text}) :
          todo
      )
    })
  },

  onComplete(id){
    this.setState({
      todos: this.state.todos.map(todo =>
        todo.id === id ?
          Object.assign({}, todo, {completed: !todo.completed}) :
          todo
      )
    })
  },

  onCompleteAll(){
    let {todos} = this.state;
    const areAllMarked = todos.every(todo => todo.completed);
    this.setState({
      todos: todos.map(todo => Object.assign({}, todo, {
        completed: !areAllMarked
      }))
    })
  },


  onClearCompleted(){
    this.setState({
      todos: this.state.todos.filter(todo => todo.completed === false)
    })
  },


  storeDidUpdate(prevState){
    let {todos} = this.state;

    if (prevState.todos !== todos) {
      const completedCount = todos.reduce((count, todo) =>
          todo.completed ? count + 1 : count,
        0
      );
      this.setState({completedCount})
    }
    console.log('xxxa')
  }
});



if(module.hot){

  module.hot.accept(function(err) {
    console.log('[HMR] Error accepting: ' + err);
  });

  if(module.hot.data){
    store.setState(module.hot.data.store.state);
    module.hot.data.store.storeDidUpdate = null;
    //module.hot.data.store.subscriptions = [];
    //if(module.hot.data.store.unsubscribe){
    //  //module.hot.data.store.unsubscribe();
    //  if(window.counter > 2){
    //    module.hot.data.store.unsubscribe()
    //      }
    //  //module.exports.default.unsubscribe();
    //}
    window.counter = window.counter ? window.counter + 1 : 1;
    console.log(window.counter);
    store.unsubscribe = store.listen(function(state) {
      console.log(store);
      module.hot.data.store.setState(state)
    });
  }


  module.hot.dispose(function(data) {
    data.store = module.exports.default

    //if(module.exports.default.unsubscribe){
    //  console.log('unsubcirbed')
    //  if(window.counter > 2){
    //    data.store.unsubscribe()
    //  }
    //}

  });
}


export default store;
