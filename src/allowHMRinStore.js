import { oldestStores } from './constants';

export default function allowHMR(_module, store) {
  if (_module.hot) {
    _module.hot.accept();

    if (_module.hot.data) {
      let prevStore = _module.hot.data.prevStore;
      store.setState(prevStore.state);
      prevStore.storeDidUpdate = null;

      store.unsubscribe = store.listen((state) => {
        window[oldestStores][_module.id].setState(state);
      });
    }


    _module.hot.dispose((data) => {
      data.prevStore = _module.exports.default;
      window[oldestStores] = window[oldestStores] || {};
      if (window[oldestStores][_module.id]) {
        data.prevStore.unsubscribe();
      } else {
        window[oldestStores][_module.id] = data.prevStore;
      }
    });
  }
}
