import {createStore} from 'cartiv';
import api from '../actions/Api';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

export default createStore({api, name: 'todo'}, {
  getInitialState(){
    return {
      filter: SHOW_ALL,
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

  onChangeFilter(){
    this.setState({ filter })
  }
});

