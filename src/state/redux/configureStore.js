import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
//import rootSaga from "./sagas";

import rootReducer from "./reducers";
import { persistStore } from "redux-persist";
//import { routerMiddleware } from 'connected-react-router';

const sagaMiddleware = createSagaMiddleware();
export default function configureStore(preloadedState) {
  //const middlewares = [apiCallsMiddleware, loggerMiddleware, thunkMiddleware.withExtraArgument(getFirestore), routerMiddleware(history)];
  const middlewares = [
    //apiCallsMiddleware,
    //loggerMiddleware,
    sagaMiddleware,
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  let enhancers;

  //persitReducer config
  enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);

  // if (__DEV__) {
  //   console.log = Reactotron.log;
  //   console.warn = Reactotron.log;
  // }
  // const store = __DEV__
  //   ? Reactotron.createStore(rootReducer, preloadedState, composedEnhancers)
  //   : createStore(rootReducer, preloadedState, composedEnhancers);
  const store = createStore(rootReducer, preloadedState, composedEnhancers);
  // then run the saga
  //sagaMiddleware.run(rootSaga);
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }
  //enhanced store
  //persistStore(store, [config, callback])
  const persistor = persistStore(store);
  //persistor.purge();
  //persistStore.purge();
  //https://github.com/prescottprue/react-redux-firebase/issues/254

  return { store, persistor };
}
