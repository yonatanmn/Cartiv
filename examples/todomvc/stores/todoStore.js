import {createStore} from 'cartiv';
import api from '../actions/Api';

const TosoStore = createStore({api, name: 'todo'},{
  //without setting `actions` in config - all methods staring with `on` will become actions
  onAdd(){

  }
});