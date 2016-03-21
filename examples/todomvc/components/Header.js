import React, { Component } from 'react';
import TodoTextInput from './TodoTextInput';
import API from '../stores/Api';

class Header extends Component {
  render() {
    return (
      <header className="header">
          <h1>todos</h1>
          <TodoTextInput newTodo
            placeholder="What needs to be done?"
            onSave={API.todo.onAdd}
          />
      </header>
    );
  }
}

export default Header;
