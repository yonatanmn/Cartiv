# Cartiv
## making Flux look as pretty as React

> [usage](#usage)

#####Simple
The goal of this library is to provide the **easiest and simplest Flux experience**, based on the the knowledge the react community has gained using older flux frameworks - Alt, Reflux and Redux. 
In Cartic there are only *Stores*, *Components* and simple *API* object to communicate between them (forget about reducers, dispatchers, switch statements, global constants, action-creators etc). And yes, simplicity comes together with scalability and flexibility!


#####Reactive like React
Cartiv wishes to provide a fully reactive paradigm, while maintaining an API that is close as possible to React's API. React has managed to control the DOM from its components in an elegant and efficient way, using state, props and events for interactivity. Cartiv uses the same logic and language, to gain control of Components from Stores, with `onSmthng` events, `setState()` and other similar methods.
React component is "functional and reactive" - `component(state) => view` (view is the outcome of the render function. if stateA === stateB, than the view will be also the same) . 
Cartiv works the same way - `store(state) => [component.state =>] view`.  This FRP approach makes the implementation of time-travel and other cool things really simple.  

#####separation of concerns
The third polar of Cartiv's architecture is a correct separation of concerns - while in most flux implementations react components are structured in a hierarchical way, with parents and children, we believe that **the view should be flat!**. Every Component is on the same level (data wise), and then it is free to be moved around, without being dependent on its parent. 
Secondly, **the view should not control the state of the app**, it can call an event, that will eventually do something, but how or when - it's not the view's responsibility.

###architecture

![cartiv architecture](/ArchitectureDrawing.png)

Think about how a React component works: 
```js
var SimpleComp = React.createClass({
  getInitialState() {
    return {text: ''};
  },
  onChange(e) {
    this.setState({text: e.target.value});
    // this is changing the state of the component. 
    // Whether it will affect any HTML elements or not is not important here. 
  },
  render() {
    return (
      <div>
        <h3>APP</h3>
          <input onChange={this.onChange} value={this.state.text} />
          // before react, input had inner state. React grabbed that away from him to the component level
          // so now input is "controlled" (value=), 
          // and it can only call an action (onChange) hoping it will change its controlled state
        <div>
        // notice that input's value is not dependent on any of its parents, 
        // you can just copy-paste it anywhere
        </div>
      </div>
    );
  }
});
```

Cartiv works the same way:
- taking the inner state of Components away (effectively creating state-less components)
- connecting the component's state to a state in a Store 
- the Store is unaware to compoenents, but it will listen to some events (actions)
- all actions are registered in one (or more) API object.
- Component can only call an action through the API object, and then (maybe) the store will change its own state 
- auto-magically every component listening to the store will get the new state

###Usage
<a name="usage"></a>

```bash
$npm install cartiv --save
```

First - create an API :
```js
import {createAPI} from 'cartiv';
let API = createAPI();
export default API;
```
Then, create a store:
```js
import {createStore} from 'cartiv';
import API from './Api';

let textStore = createStore(
  { 
    /* this is the store config: */
    api: API, // listen to actions coming from api
    name: 'text', // actions under 'text' property, e.g: api.text.onAction
    // config.actions can either be an array of strings or a filter function. 
    // config.actions is optional, 
    // when not provided, all methods starting with 'on' will get called
    actions: ['onChange', 'onSomethingElse'], // specify methods that will get called when equivalent action triggered
    actions: function(action){return action.indexOf('get') > -1} //custom filter function 
  }, 
  {
    /* this is the store definition: */
    getInitialState(){ // same as React!
      return {
        text: 'Use Cartiv!',
        }
    },
    
    onChange(textFromAction){
      this.setState({text: textFromAction}); // same as React! 
      // setState changes the store state. Instead of `rendering` like react - this will `control` 
      // every connected component, that in turn will re-render
    },
    
    storeDidUpdate(prevState){ // same as React!
      if(this.state.text !== prevState.text){console.log('text has changed'); }
    } 
  });
  
  createStore.allowHMR(module, textStore); //if you want to use webpack's hot-module-replacement 
  export default textStore;

```

Lastly, connect the component to the store: 
```js
import {connect} from 'cartiv';
import textStore from '../stores/textStore';
import API from '../stores/Api';

var SimpleComp = React.createClass({
  mixins:[
    connect(
      textStore, // connect to the state of this Cartiv store
      'text', // optional - connect only to this property of store's state. 
              // if not specified it will connect to all of the store's state
              // more options: 
              // {text: inputText} // key is the state in store, val is the new name it will get in this component
              // [{text: inputText}, 'someOtherState'...] //mixed list of previous options
      'someName' // optional -  the state will be available under this property. e.g: this.state.someName.text
    ),
     connect(otherStore, 'someState'), //...
  ], 
  onChange(e) {
    //this.setState({text: e.target.value});  //we don't use inner state any more
    API.text.onChange(e.target.value)
  },
  render() {
    return (
      <div>
        <h3>APP</h3>
        <input onChange={this.onChange} value={this.state.text} />
        //nothing changed here!
      <div>
    );
  }
});
```

If you are using react es6 classes, connect with es7 decorators */ 
```js
import {createConnector} from 'cartiv';
const connect = createConnector(React);

@connect(textStore) //same signature as the mixin one
class SimpleComp extends Component { ...
```




[this basic usage code, without all the comments](https://jsfiddle.net/yonatanmn/gwk75qfw/1/), 

[todoMVC example](https://github.com/yonatanmn/Cartiv/tree/master/examples/todomvc) (copied from Redux repo, removed all the unnecessary parts and now it's Cartiv!)

Can you get any simpler?

(if you think you can - tell me your ideas - Cartiv is still young, and open for any thing that will help building react apps in the simplest possible way)

#####Wath's next
- Adding cartiv-history component for development, easy time travel through the history of the stores' states (state history actions history!)
- Boilerplate of Cartiv + server - adding `connect` to server from store with sockects (Meteorizing react! yay!)


###acknowledgments
The internals of this library are based on [reflux-core](https://github.com/reflux/refluxjs). This guarantees the stability of a mature framework with this new interface. 
I thank @spoike and the rest of the reflux community.

Cartiv has began as a [mixin for reflux](https://github.com/yonatanmn/Super-Simple-Flux#reflux-state-mixin), that succeeded quite well. Later this was titled as a specification called [super simple flux](https://github.com/yonatanmn/Super-Simple-Flux). 

I've found out that Cartiv shares many ideas with [om](https://github.com/omcljs/om). great library, take a look.
