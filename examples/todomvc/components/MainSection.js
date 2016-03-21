import React, { Component } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { createConnector } from 'cartiv';
let connect = createConnector(React);
import todoStore from '../stores/todoStore';
import API from '../stores/Api';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

//enum - not redux stuff
const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
};
@connect(todoStore, 'todos')
@connect(todoStore, 'completedCount')
@connect(todoStore, 'filter')
class MainSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filter: SHOW_ALL
    };
  }

  renderToggleAll(completedCount) {
    const { todos } = this.state;
    return todos.length > 0 && (
      <input className="toggle-all"
        type="checkbox"
        checked={completedCount === todos.length}
        onChange={API.todo.onCompleteAll}
      />
    );
  }

  renderFooter() {
    const { todos } = this.state;
    return !!todos.length && <Footer/>;
  }

  render() {
    const { todos, filter, completedCount } = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[filter]);


    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todoId={todo.id}/>
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    );
  }
}

//MainSection.propTypes = {
//  todos: PropTypes.array.isRequired,
//  actions: PropTypes.object.isRequired
//}

export default MainSection;
