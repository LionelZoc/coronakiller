import { createSelector } from "reselect";
//import createCachedSelector from "re-reselect";
import get from "lodash/get";
const getLocale = (state) => {
  console.log("state", state);
  return get(state, "core.locale", "");
};
const getHighScore = (state) => get(state, "core.highScore", "");

export const getLocaleSelector = createSelector(getLocale, (locale) => {
  console.log("localllel", locale);
  return locale;
});

export const getHighScoreSelector = createSelector(getHighScore, (score) => {
  return score;
});
