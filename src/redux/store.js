import appReducer from '../reducers/rootReducer'
import rootReducer from '../reducers/rootReducer';
import apiMiddleware from './apiMiddleware'
import { createStore, applyMiddleware, compose } from 'redux'

  const store = createStore(
    appReducer,
    compose(applyMiddleware(apiMiddleware))
  );


export default store