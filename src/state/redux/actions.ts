import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
  GAME_SET_REMAINING_TIME,
  GAME_SET_LEVEL,
  GAME_UPDGRADE_LEVEL,
  GAME_TOOGLE_SOUND,
  GAME_SEE_PRESENTATION,
  UPDATE_REQUEST_STATUS,
  CREATE_PROFILE,
  UPDATE_BEST_SCORE,
  PURGE_PERSISTED_DATA,
} from "state/redux/actionTypes";
import { targetType } from "constants/game";

export const updateGameHighScore = ({ score, level, playTime }) => ({
  type: GAME_UPDATE_HIGH_SCORE,
  payload: { score, level, playTime },
});

//todo add typing to specify the allowed targets
export const updateGameTarget = (target: targetType) => ({
  type: GAME_SET_TARGET,
  payload: target,
});
export const updateTimer = (time) => ({
  type: GAME_SET_REMAINING_TIME,
  payload: time,
});
export const setLevel = (level) => ({
  type: GAME_SET_LEVEL,
  payload: level,
});
export const upgradeLevel = (current) => ({
  type: GAME_UPDGRADE_LEVEL,
  payload: current,
});
export const toggleSound = () => ({
  type: GAME_TOOGLE_SOUND,
});

export const seePresentation = () => ({
  type: GAME_SEE_PRESENTATION,
});

//action
export const setRequestStatus = ({ id, status }) => ({
  type: UPDATE_REQUEST_STATUS,
  payload: { id: id, status: status },
});

export const createProfile = (payload) => ({
  type: CREATE_PROFILE,
  payload,
});

export const updateBestScore = (payload) => ({
  type: UPDATE_BEST_SCORE,
  payload,
});

export const purgePersistedData = (payload) => ({
  type: PURGE_PERSISTED_DATA,
  payload,
});
