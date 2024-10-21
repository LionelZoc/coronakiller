import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
  GAME_SET_REMAINING_TIME,
  GAME_SET_LEVEL,
  GAME_UPDGRADE_LEVEL,
  GAME_TOOGLE_SOUND,
  GAME_SEE_PRESENTATION,
  PURGE_PERSISTED_DATA,
} from "state/redux/actionTypes";
import toNumber from "lodash/toNumber";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import { clearPersistedStore } from "utils/store";

const initialLocalState = {
  locale: "en",
  highScore: 0,
  highScoreLevel: 1,
  highScorePlaytime: 80,
  previousLevelHighScore: 0,
  level: 1,
  target: "bug",
  restTime: 60,
  soundOn: false,
  totalPlayTime: 60,
  seePresentation: false,
  userSelectedTarget: false,
};
const localeReducer = (state = initialLocalState, action) => {
  switch (action.type) {
    case "SET_USER_LOCALE": {
      //("set user locale", action);
      if (action.locale !== state.locale) {
        //(" action.locale !== state.locale", action);
        return Object.assign({}, state, { locale: action.locale });
      } else return state;
    }
    case GAME_SET_REMAINING_TIME: {
      return {
        ...state,
        restTime: action.payload,
        totalPlayTime: state.totalPlayTime + 10,
      };
    }
    case GAME_UPDATE_HIGH_SCORE: {
      return {
        ...state,
        highScore: action.payload.score,
        highScoreLevel: action.payload.level,
        highScorePlaytime: action.payload.playTime,
      };
    }
    case GAME_SET_TARGET: {
      return {
        ...state,
        target: action.payload,
        userSelectedTarget: true,
      };
    }
    case GAME_UPDGRADE_LEVEL: {
      return {
        ...state,
        level: toNumber(state.level) ? toNumber(state.level) + 1 : 2,
        previousLevelHighScore: state.highScore,
        highScore: 0,
      };
    }
    case GAME_SET_LEVEL: {
      return {
        ...state,
        level: action.payload,
      };
    }
    case GAME_TOOGLE_SOUND: {
      return {
        ...state,
        soundOn: !state.soundOn,
      };
    }
    case GAME_SEE_PRESENTATION: {
      return {
        ...state,
        seePresentation: true,
      };
    }
    case PURGE_PERSISTED_DATA: {
      clearPersistedStore();
      return initialLocalState;
    }

    default:
      //put the propertyCreaction reducer here
      return state;
  }
};

let localPersistConfig = {
  key: "game",
  //debug: true,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: [
    "locale",
    "highScore",
    "target",
    "level",
    "soundOn",
    "totalPlayTime",
    "seeDemo",
    "seePresentation",
    "userSelectedTarget",
  ],
};
let firestorePersistConfig = {
  key: "firestoreState",
  //debug: true,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  //version: 0
  blacklist: ["queries"],
};
let firebasePersistConfig = {
  key: "firebaseState",
  //debug: true,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};
//the routerReducer must be under the routing key
const rootReducer = combineReducers({
  core: persistReducer(localPersistConfig, localeReducer),
  firebase: persistReducer(firebasePersistConfig, firebaseReducer),
  firestore: persistReducer(firestorePersistConfig, firestoreReducer),
});

//export default persistedReducer;
export default rootReducer;
