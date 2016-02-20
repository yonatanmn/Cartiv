import React, { Component, PropTypes } from 'react'
import todoStore from '../stores/todoStore';
import filterStore from '../stores/anotherStore';
import {connect} from 'cartiv';

const History = React.createClass({
  mixins:[
    connect(todoStore),
    connect(filterStore)
  ],

  render() {
    let floatingStyle = {
      position: 'fixed',
      top: 10,
      left: 10
    };
    return (
      <div style={Object.assign({}, floatingStyle)}>
        {JSON.stringify(this.state)}
      </div>
    )
  }
});

export default History;