import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { AsyncStorage } from "react-native";
import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
  GAME_SET_REMAINING_TIME,
  GAME_SET_LEVEL,
  GAME_UPDGRADE_LEVEL,
  GAME_TOOGLE_SOUND,
} from "state/redux/actionTypes";
import toNumber from "lodash/toNumber";

const initialLocalState = {
  locale: "en",
  highScore: 0,
  previousLevelHighScore: 0,
  level: 1,
  targetSelected: "bug",
  restTime: 60,
  soundOn: true,
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
      };
    }
    case GAME_UPDATE_HIGH_SCORE: {
      return {
        ...state,
        highScore: action.payload,
      };
    }
    case GAME_SET_TARGET: {
      return {
        ...state,
        target: action.payload,
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
    "targetSelected",
  ],
};

//the routerReducer must be under the routing key
const rootReducer = combineReducers({
  core: persistReducer(localPersistConfig, localeReducer),
});

//export default persistedReducer;
export default rootReducer;
