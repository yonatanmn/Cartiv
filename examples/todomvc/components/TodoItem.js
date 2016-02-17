import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import {createConnector} from 'cartiv';
let connect = createConnector(React);
import todoStore from '../stores/todoStore';
import API from '../actions/Api';

@connect(todoStore, 'todos')
class TodoItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editing: false
    }
  }

  handleDoubleClick() {
    this.setState({ editing: true })
  }

  handleSave(id, text) {
    if (text.length === 0) {
      API.todo.onDelete(id)
    } else {
      API.todo.onEdit(id, text)
    }
    this.setState({ editing: false })
  }

  render() {
    const { todo } = this.props;

    let element
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      )
    } else {
      element = (
        <div className="view">
          <input className="toggle"
                 type="checkbox"
                 checked={todo.completed}
                 onChange={() => API.todo.onComplete(todo.id)} />
          <label onDoubleClick={this.handleDoubleClick.bind(this)}>
            {todo.text}
          </label>
          <button className="destroy"
                  onClick={() => API.todo.onDelete(todo.id)} />
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  }
}


export default TodoItem

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired
}