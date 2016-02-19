export default function allowHMR(_module, store){
  if(_module.hot) {
    _module.hot.accept();

    if (_module.hot.data) {
      let prevStore = _module.hot.data.prevStore;
      store.setState(prevStore.state);
      prevStore.storeDidUpdate = null;

      store.unsubscribe = store.listen(function (state) {
        window['__oldestStores__'][_module.id].setState(state);
      });
    }


    _module.hot.dispose(function (data) {
      data.prevStore = _module.exports.default;
      window['__oldestStores__'] = window['__oldestStores__'] || {};
      if (window['__oldestStores__'][_module.id]) {
        data.prevStore.unsubscribe()
      } else {
        window['__oldestStores__'][_module.id] = data.prevStore;
      }
    });
  }
}