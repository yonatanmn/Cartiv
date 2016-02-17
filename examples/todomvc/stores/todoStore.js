import {createStore} from 'cartiv';
import api from '../actions/Api';

const TosoStore = createStore({api, name: 'todo'}, {
  getInitialState(){
    return {
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
  }
});