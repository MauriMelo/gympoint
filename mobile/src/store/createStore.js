import { createStore, compose, applyMiddleware } from 'redux';
import Config from 'react-native-config';

export default (reducers, middlewares) => {
  const enhancer =
    Config.APP_ENV === 'DEV'
      ? compose(console.tron.createEnhancer(), applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares);
  return createStore(reducers, enhancer);
};
