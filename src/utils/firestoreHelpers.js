import { getFirestore } from "redux-firestore";
import * as Sentry from "sentry-expo";
import isEmpty from "lodash/isEmpty";
import { database } from "state/firebaseConfig/config";
import * as Facebook from "expo-facebook";

const getUserScoreConf = (id) => {
  if (isEmpty(id)) return null;
  return {
    collection: database.scores,
    doc: id,
    storeAs: "user_best_score",
  };
};
export const fetchUserBestScore = (id) => {
  const firestore = getFirestore();
  const conf = getUserScoreConf(id);
  if (!isEmpty(conf)) {
    firestore.get(conf);
  }
};
export const getFacebookAuth = async () => {
  await Facebook.initializeAsync({
    appId: "1256149281508808",
  });
  const auth = await Facebook.getAuthenticationCredentialAsync();

  return auth;
  // if (!auth) {
  //   // Log in
  //   console.log("not connected");
  //   //setConnected(false)
  // } else {
  //   // Log out
  //   console.log("user connected", auth);
  //   Sentry.Native.captureMessage("user connected", auth);
  //   //setConnected(true)
  // }
};
export const updateScore = async ({ level, score, kps, userId }) => {
  console.log("should update score");
};

export const createProfile = async ({
  //token,
  //userId,
  firebaseUserId,
  force,
}) => {
  try {
    const fcbkAuth = await getFacebookAuth();
    if (!fcbkAuth) {
      // Sentry.Native.captureMessage("fcbk is not connected");
      // console.log("user fbck not connected");
      return null;
    }
    const { token, userId } = fcbkAuth;
    const response = await fetch(
      `https://graph.facebook.com/${userId}?access_token=${token}&fields=id,name,picture.type(large)`
    );
    const { picture, name, id } = await response.json();
    const firestore = getFirestore();
    //firestore.get({ collection: "users", doc: firebaseUserId })
    try {
      const profileDoc = await firestore.doc(`users/${firebaseUserId}`).get();
      console.log("able to get profile doc", profileDoc);
      Sentry.Native.captureException(profileDoc);
    } catch (e) {
      Sentry.Native.captureException(e);
    }
    firestore.set(
      { collection: "users", doc: firebaseUserId },
      { picture, name, id }
    );
  } catch (e) {
    console.log(e);
    Sentry.Native.captureException(e);
  }
};
