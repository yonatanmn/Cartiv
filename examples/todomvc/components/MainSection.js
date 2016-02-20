import React, { Component, PropTypes } from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import {createConnector} from 'cartiv';
let connect = createConnector(React);
import todoStore from '../stores/todoStore';
import filterStore from '../stores/anotherStore';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

//enum - not redux stuff
const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
}
@connect(todoStore, 'todos')
@connect(todoStore, 'completedCount')
@connect(filterStore, 'filter')
class MainSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      filter: SHOW_ALL
    }
  }





  handleCompletedAll(){
    // todo:
    //actions.completeAll
  }

  renderToggleAll(completedCount) {
    const { todos } = this.state
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
               onChange={this.handleCompletedAll} />
      )
    }
  }

  renderFooter() {
    const { todos } = this.state

    if (todos.length) {
      return (
        <Footer/>
      )
    }
  }

  render() {
    const { todos, filter, completedCount } = this.state

    const filteredTodos = todos.filter(TODO_FILTERS[filter])


    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todoId={todo.id} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}

//MainSection.propTypes = {
//  todos: PropTypes.array.isRequired,
//  actions: PropTypes.object.isRequired
//}

export default MainSection
