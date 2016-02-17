import React, { PropTypes, Component } from 'react'
import classnames from 'classnames'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

import {createConnector} from 'cartiv';
let connect = createConnector(React);
import todoStore from '../stores/todoStore';
import API from '../stores/Api';


const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

@connect(todoStore, 'filter')
@connect(todoStore, 'todos')
@connect(todoStore, 'completedCount')
class Footer extends Component {
  renderTodoCount() {
    const { completedCount, todos = [] } = this.state
    const activeCount = todos.length - completedCount;

    const itemWord = activeCount === 1 ? 'item' : 'items'

    return (
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
    )
  }

  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter]
    const { filter: selectedFilter } = this.state

    return (
      <a className={classnames({ selected: filter === selectedFilter })}
         style={{ cursor: 'pointer' }}
         onClick={() => API.todo.onChangeFilter(filter)}>
        {title}
      </a>
    )
  }

  renderClearButton() {
    const { completedCount } = this.state
    if (completedCount > 0) {
      return (
        <button className="clear-completed"
                onClick={API.todo.onClearCompleted} >
          Clear completed
        </button>
      )
    }
  }

  render() {
    return (
      <footer className="footer">
        {this.renderTodoCount()}
        <ul className="filters">
          {[ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ].map(filter =>
            <li key={filter}>
              {this.renderFilterLink(filter)}
            </li>
          )}
        </ul>
        {this.renderClearButton()}
      </footer>
    )
  }
}

Footer.propTypes = {
}

export default Footer
