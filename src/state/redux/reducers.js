import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { AsyncStorage } from "react-native";
import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
} from "state/redux/actionTypes";

const initialLocalState = {
  locale: "en",
  highScore: 0,
  level: "",
  targetSelected: "bug",
};
const localeReducer = (state = initialLocalState, action) => {
  console.log("reducer", action);
  switch (action.type) {
    case "SET_USER_LOCALE": {
      //("set user locale", action);
      if (action.locale !== state.locale) {
        //(" action.locale !== state.locale", action);
        return Object.assign({}, state, { locale: action.locale });
      } else return state;
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
  whitelist: ["locale", "highScore", "target", "level"],
};

//the routerReducer must be under the routing key
const rootReducer = combineReducers({
  core: persistReducer(localPersistConfig, localeReducer),
});

//export default persistedReducer;
export default rootReducer;
