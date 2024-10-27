import { getFirestore } from "redux-firestore";
import * as Sentry from '@sentry/react-native';
import isEmpty from "lodash/isEmpty";
import { database } from "state/firebaseConfig/config";
//import * as Facebook from "expo-facebook";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  Settings,
  ShareDialog,
} from "react-native-fbsdk-next";

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

//to change
export const getFacebookAuth = async () => {
  // await Facebook.initializeAsync({
  //   appId: "1256149281508808",
  // });
  // const auth = await Facebook.getAuthenticationCredentialAsync();

  // return auth;

  return true;
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
//to change
export const getFacebookUser = async (auth) => {
  // if (!auth) return {};
  // const { token, userId } = auth;
  // const response = await fetch(
  //   `https://graph.facebook.com/${userId}?access_token=${token}&fields=id,name,picture.type(large)`
  // );
  // const { picture, name, id } = await response.json();
  return { picture: "picture", name: 'test', id: 'id' };
};
export const updateScore = async ({
  level,
  value,
  playTime,
  username,
  userId,
  rank,
  force,
}) => {
  console.log("should update score");
  // {
  //   level,value, owner, username,playtime,rank,
  // }
  try {
    const firestore = getFirestore();
    const scoreData = {
      level,
      value,
      playTime,
      username,
      rank,
      id: userId,
    };
    if (force) {
      firestore.set({ collection: "scores", doc: userId }, scoreData);
    } else {
      firestore.update({ collection: "scores", doc: userId }, scoreData);
    }
  } catch (e) {
    Sentry.captureException(e);
  }
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
    const { picture, name, id } = getFacebookUser(fcbkAuth);
    const firestore = getFirestore();
    //firestore.get({ collection: "users", doc: firebaseUserId })
    try {
      const profileDoc = await firestore.doc(`users/${firebaseUserId}`).get();
      console.log("able to get profile doc", profileDoc);
      Sentry.captureException(profileDoc);
    } catch (e) {
      Sentry.captureException(e);
    }
    firestore.set(
      { collection: "users", doc: firebaseUserId },
      { picture, name, id }
    );
  } catch (e) {
    console.log(e);
    Sentry.captureException(e);
  }
};
