import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import root_reducer from './reducers';

const middleware = [
  thunk
];

const store = createStore(root_reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));

export default store;