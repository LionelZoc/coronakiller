import { createSelector } from "reselect";
//import createCachedSelector from "re-reselect";
import get from "lodash/get";
const getLocale = (state) => {
  return get(state, "core.locale", "");
};
const getRestTime = (state) => {
  return get(state, "core.restTime", 60);
};
const getHighScore = (state) => get(state, "core.highScore", 0);
const getLevel = (state) => {
  return get(state, "core.level", 1);
};
const getSeePresentation = (state) => get(state, "core.seePresentation", false);
const getSoundOn = (state) => get(state, "core.soundOn", false);

export const getLocaleSelector = createSelector(getLocale, (locale) => {
  return locale;
});

export const getHighScoreSelector = createSelector(getHighScore, (score) => {
  return score;
});

export const getRestTimeSelector = createSelector(getRestTime, (time) => {
  return time;
});

export const getLevelSelector = createSelector(getLevel, (level) => {
  return level;
});

export const getSoundOnSelector = createSelector(getSoundOn, (state) => {
  return state;
});

export const getSeePresentationSelector = createSelector(
  getSeePresentation,
  (seeState) => seeState
);
