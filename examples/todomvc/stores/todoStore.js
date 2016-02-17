import {createStore} from 'cartiv';
import api from '../actions/Api';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

export default createStore({api, name: 'todo'}, {
  getInitialState(){
    return {
      filter: SHOW_ALL,
      completedCount: 0,
      todos: [{
        text: 'Use Redux',
        completed: false,
        id: 0
      }]
    }
  },

  onAdd(text){
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
    this.setState({ filter })
  },

  storeDidUpdate(prevState){
    let {todos} = this.state;

    if(prevState.todos !== todos){
      const completedCount = todos.reduce((count, todo) =>
          todo.completed ? count + 1 : count,
        0
      );
      this.setState({completedCount})
    }
  }
});

