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
    console.log('xssa')
  }
});
export default store;



if(module.hot){
  module.hot.accept();

  if(module.hot.data){
    let prevStore = module.hot.data.prevStore;
    store.setState(prevStore.state);
    prevStore.storeDidUpdate = null;

    store.unsubscribe = store.listen(function(state) {
        window['__oldestStores__'][module.id].setState(state);
    });
  }


  module.hot.dispose(function(data) {
    data.prevStore = module.exports.default;
    window['__oldestStores__'] = window['__oldestStores__'] || {};
    if(window['__oldestStores__'][module.id]){
        data.prevStore.unsubscribe()
    } else {
      window['__oldestStores__'][module.id] = data.prevStore;
    }
  });
}


