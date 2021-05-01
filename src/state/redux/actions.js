import {
  GAME_UPDATE_HIGH_SCORE,
  GAME_SET_TARGET,
} from "state/redux/actionTypes";
export const updateGameHighScore = (score) => ({
  type: GAME_UPDATE_HIGH_SCORE,
  payload: score,
});

export const updateGameTarget = (target) => ({
  type: GAME_SET_TARGET,
  payload: target,
});
