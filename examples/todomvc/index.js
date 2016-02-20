import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import 'todomvc-app-css/index.css'
import History from './stores/History';


render(
  <div>
    <App />
    <History/>
  </div>
  ,
  document.getElementById('root')
)
