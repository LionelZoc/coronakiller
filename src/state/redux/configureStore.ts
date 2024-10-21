import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

import rootReducer from "./reducers";
import { persistStore } from "redux-persist";
import firebase, { getEnvVars } from "state/firebaseConfig/config";
import get from "lodash/get";
import { createFirestoreInstance, reduxFirestore } from "redux-firestore";

import { actionTypes } from "redux-firestore";
import Reactotron from "../ReactotronConfig";

import { composeWithDevTools } from "redux-devtools-extension";
//import { routerMiddleware } from 'connected-react-router';

const sagaMiddleware = createSagaMiddleware();
const env = getEnvVars();
let persistor = null;
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
  // enhancers = [
  //   middlewareEnhancer,
  //   reduxFirestore(firebase, get(env, "reduxFirestoreConfig")),
  // ];
  enhancers = __DEV__
    ? [
        middlewareEnhancer,
        reduxFirestore(firebase, get(env, "reduxFirestoreConfig")),
        Reactotron.createEnhancer(),
      ]
    : [
        middlewareEnhancer,
        reduxFirestore(firebase, get(env, "reduxFirestoreConfig")),
      ];

  const composedEnhancers = composeWithDevTools(...enhancers);

  if (__DEV__) {
    console.log = Reactotron.log;
    console.warn = Reactotron.log;
  }
  //const composedEnhancers = compose(...enhancers);

  // if (__DEV__) {
  //   console.log = Reactotron.log;
  //   console.warn = Reactotron.log;
  // }
  // const store = __DEV__
  //   ? Reactotron.createStore(rootReducer, preloadedState, composedEnhancers)
  //   : createStore(rootReducer, preloadedState, composedEnhancers);
  const store = createStore(rootReducer, preloadedState, composedEnhancers);
  // then run the saga
  sagaMiddleware.run(rootSaga);
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }
  //enhanced store
  //persistStore(store, [config, callback])
  persistor = persistStore(store);
  //persistor.purge();
  //https://github.com/prescottprue/react-redux-firebase/issues/254
  const rrfConfig = {
    userProfile: "users", // firebase root where user profiles are stored // enable/disable Firebase's database logging
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    attachAuthIsReady: true,
    presence: "onlineUsers",
    resetBeforeLogin: false, //reset auth and profile before login,
    //useFirestoreForStorageMeta: false,
    enableRedirectHandling: false,
    onAuthStateChanged: (authData, firebase, dispatch) => {
      // Clear redux-firestore state if auth does not exist (i.e logout)

      if (!authData) {
        dispatch({ type: actionTypes.CLEAR_DATA });
      }
    },
    //enableLogging: true,
    logErrors: true,
    //updateProfileOnLogin: false, //test
    logListenerError: true, //very important to see clearly firebase and firestore error in console
  };

  const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance, // <- needed if using firestore
  };

  return { store, persistor, rrfProps };
}

export { persistor };
