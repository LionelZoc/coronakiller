import { createSelector } from "reselect";
import { isLoaded, isEmpty } from "react-redux-firebase";
import createCachedSelector from "re-reselect";
//import createCachedSelector from "re-reselect";

import get from "lodash/get";
// FIREBASE STATE SELECTOR
export const getFirebaseAuth = (state) => get(state, "firebase.auth", {});
export const getAuthError = (state) => get(state, "firebase.authError", {});
// export const getProfile = state => {
//   return state.core.cachedProfile;
// };
export const getProfile = (state) => {
  return state.firebase.profile;
};
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
const getTargetSelected = (state) => get(state, "core.target", "bug");
const getUserSelectedTarget = (state) =>
  get(state, "core.userSelectedTarget", false);

export const firebaseAuthSelector = createSelector(
  getFirebaseAuth,
  (auth) => auth
);

export const firebaseUidSelector = createSelector(
  getFirebaseAuth,
  (auth) => auth.uid
);

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

export const getTargetSelectedSelector = createSelector(
  getTargetSelected,
  (target) => target
);
export const getIfUserSelectedTargetSelector = createSelector(
  getUserSelectedTarget,
  (selected) => selected
);

export const getCachedProfileSelector = createCachedSelector(
  getProfile,
  getFirebaseAuth,
  (state, id) => id,
  (profile, auth, id) => {
    if (
      isLoaded(profile) &&
      isLoaded(auth) &&
      !isEmpty(profile) &&
      !isEmpty(auth)
    ) {
      return { profile: profile, auth: auth, id: id };
    }

    return {};
  }
)((state, id) => `profile_${id}`);
