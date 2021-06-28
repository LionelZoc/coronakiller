import firebase from "firebase/app";
import Constants from "expo-constants";
import { Platform } from "react-native";
//import { config } from "../config/config";
//import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
//import * as Sentry from "sentry-expo";
import _ from "lodash";

const localhost = Platform.OS === "ios" ? "localhost:8080" : "10.0.2.2:8080";

export const database = {
  scores: "scores",
  notifications: "notifications",
  user_metas: "user_metas",
  challenge_requests: "challenge_requests",
  users: "users",
};

export const reduxFirestoreConfig = {
  preserveOnListenerError: ["data", "ordered"],
  allowMultipleListeners: true,
  logListenerError: true,
  logErrors: true,
};
const ENV = {
  dev: {
    config: {
      apiKey: "AIzaSyC0iOZS3GN_xdP_TvN4lJ4VeNWxf38RaZ0",
      authDomain: "viralert-dev.firebaseapp.com",
      projectId: "viralert-dev",
      storageBucket: "viralert-dev.appspot.com",
      messagingSenderId: "668383957107",
      appId: "1:668383957107:web:ae7494a92a27bbc3bb5a06",
      measurementId: "G-45G7MZRD84",
    },
    reduxFirestoreConfig: {
      preserveOnListenerError: ["data", "ordered"],
      allowMultipleListeners: true,
      logListenerError: true,
      logErrors: true,
    },
  },
  staging: {
    apiUrl: "https://apidev.jimmoapp.fr",
    amplitudeApiKey: "[Enter your key here]",
    // Add other keys you want here
  }, //finaly i only changed firebase config. i keep google maps and fcm the same
  prod: {
    config: {
      apiKey: "AIzaSyCVj4yqvBcg0f7p5qiyipkfA2Avj26LdEc",
      authDomain: "viralert-prod.firebaseapp.com",
      projectId: "viralert-prod",
      storageBucket: "viralert-prod.appspot.com",
      messagingSenderId: "570585447945",
      appId: "1:570585447945:web:d42668fb863bff90c002d8",
      measurementId: "G-7N8QJR6XPZ",
    },
    reduxFirestoreConfig: {
      preserveOnListenerError: ["data", "ordered"],
      allowMultipleListeners: true,
      logListenerError: true,
      logErrors: true,
    },
    // google: {
    //   placeAPiKey: "AIzaSyCf-xSmXjnqIVtp5nHotxhvKQP2OF608vQ",
    // },
    // Add other keys you want here
  },
};
export const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.

  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  } else if (env === "dev") {
    return ENV.dev;
  } else {
    return ENV.prod;
  }
};

if (!firebase.apps.length) {
  const env = getEnvVars();
  firebase.initializeApp(_.get(env, "config"));
}

export const firestore = firebase.firestore();

// .enablePersistence()
// .then(() => console.log("offline persistence enabled for firestore"))
// .catch(function(err) {
//   if (err.code == "failed-precondition") {
//     // Multiple tabs open, persistence can only be enabled
//     // in one tab at a a time.
//     Sentry.captureException(
//       "Multiple tabs open, persistence can only be enabled in one tab at a a time."
//     );
//     console.log(
//       "Multiple tabs open, persistence can only be enabled in one tab at a a time."
//     );
//     // ...
//   } else if (err.code == "unimplemented") {
//     // The current browser does not support all of the
//     // features required to enable persistence
//     Sentry.captureException(
//       " The current browser does not support all of the features required to enable persistence"
//     );
//     console.log(
//       " The current browser does not support all of the features required to enable persistence"
//     );
//     // ...
//   }
// });
export default firebase;
