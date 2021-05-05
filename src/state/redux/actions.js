import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
  GAME_SET_REMAINING_TIME,
  GAME_SET_LEVEL,
  GAME_UPDGRADE_LEVEL,
} from "state/redux/actionTypes";

export const updateGameHighScore = (score) => ({
  type: GAME_UPDATE_HIGH_SCORE,
  payload: score,
});

export const updateGameTarget = (target) => ({
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
