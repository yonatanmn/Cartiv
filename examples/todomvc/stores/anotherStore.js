import {createStore} from 'cartiv';
import api from './Api';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'
import store from './todoStore';

let filterStore = createStore({api, name: 'filter'}, {
  getInitialState(){
    return {
      filter: SHOW_ALL
    }
  },

  onChangeFilter(filter){
    this.setState({filter})
  },
  storeDidUpdate(prevState){
    console.log(store.getInitialState())
  }

});
export default filterStore;



createStore.allowHMR(module, filterStore);


