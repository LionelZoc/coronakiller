import { createSelector } from "reselect";
//import createCachedSelector from "re-reselect";
import get from "lodash/get";
const getLocale = (state) => {
  return get(state, "core.locale", "");
};
const getRestTime = (state) => {
  return get(state, "core.restTime", 60);
};
const getHighScore = (state) => get(state, "core.highScore", "");

export const getLocaleSelector = createSelector(getLocale, (locale) => {
  return locale;
});

export const getHighScoreSelector = createSelector(getHighScore, (score) => {
  return score;
});

export const getRestTimeSelector = createSelector(getRestTime, (time) => {
  return time;
});
