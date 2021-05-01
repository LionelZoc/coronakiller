import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
  GAME_SET_REMAINING_TIME,
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
