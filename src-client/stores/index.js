const { createStore, applyMiddleware, compose } = require('redux');
const thunk = require('redux-thunk').default;
const Immutable = require('immutable');

const mainReducer = require('../reducers');
const config = require('../../util/config');

const composeEnhancers = (config.isDev && config.isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

module.exports = (initialState) => {
  const store = createStore(
    mainReducer,
    Immutable.fromJS(initialState),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
