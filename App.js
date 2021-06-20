import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Platform } from "react-native";
//import PropTypes from "prop-types";
import * as Sentry from "sentry-expo";
import { cacheImages } from "utils/assetsCaching";
import ImageAsset, { Sounds } from "assets";
import AppLoading from "expo-app-loading";
// import "intl";
// import "intl/locale-data/jsonp/en";
// import "intl/locale-data/jsonp/fr";
//import { IntlProvider } from "react-intl";
import configureStore from "state/redux/configureStore";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import enMessages from "translations/en.json";
// import frMessages from "translations/fr.json";
import ActivityIndicator from "components/ActivityIndicator";
// import {
//   getSeePresentationSelector,
//   getIfUserSelectedTargetSelector,
// } from "state/redux/selectors";

import { Audio } from "expo-av";
import impactSound from "assets/impact.mp3";
//import failSound from "assets/fail.mp3";
import { BoardContextProvider } from "containers/boardContext";

import { getSoundOnSelector } from "state/redux/selectors";

// import { FormattedMessage, useIntl } from "react-intl";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "navigation/AppNavigator";

//sentry config
Sentry.init({
  dsn:
    "https://17cb517f845d44f09f86882d616a092d@o233134.ingest.sentry.io/5744317",
  enableInExpoDevelopment: true,
  //environment: "prod"
  //debug: true
});

//configure redux store
let { store, persistor } = configureStore();

// const messages = {
//   en: enMessages,
//   fr: frMessages,
// };

const App = () => {
  //const intl = useIntl();
  //const locale = useSelector(getLocaleSelector);
  const [ifLoadingComplete, setIfLoadingComplete] = useState(false);
  //const seePresentation = useSelector(getSeePresentationSelector);
  //const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);
  const isMounted = useRef(false);
  const [boxSize, setBoxSize] = useState(16);
  const [timeout, setTimeout] = useState(60);
  const [error, setError] = useState(false);
  const [sound, setSound] = useState();
  const soundOn = useSelector(getSoundOnSelector);

  useEffect(() => {
    try {
      const initAudio = async () =>
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
        });
      initAudio();
      const load = async () => {
        //init sound

        const { sound } = await Audio.Sound.createAsync(impactSound, {
          shouldPlay: false,
        });
        // const { missSound } = await Audio.Sound.createAsync(failSound, {
        //   shouldPlay: false,
        // });
        setSound(sound);
        //setMissSound(missSound);
      };
      load();
    } catch (e) {
      setError(true);
      Platform.OS === "web"
        ? Sentry.Browser.captureException(e)
        : Sentry.Native.captureException(e);
    }
  }, []);

  const playSoundMemo = useCallback(
    (type = "hit") => {
      const playSound = async () => {
        //await sound.replayAsync({positionMillis: 0, shouldPlay: true})
        //await sound.setStatusAsync({positionMillis: 0, shouldPlay: true})
        if (type === "hit") {
          await sound.stopAsync();
          await sound.playAsync();
        } else {
          //await missSound.stopAsync();
          //await missSound.playAsync();
        }
      };
      if (soundOn) playSound(type);
    },
    [sound, soundOn]
  );

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  const loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      ImageAsset.icon,
      ImageAsset.icon512,
      ImageAsset.icon1024,
      ImageAsset.mask,
      ImageAsset.SplashTransparent,
      ImageAsset.SplashTransparentIos,
      ImageAsset.target,
      ImageAsset.targetBug,
      Sounds.impact,
      //Sounds.fail,
    ]);

    return Promise.all([...imageAssets]);
  };

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      //console.log("unmounting app with current", isMounted.current);
    };
  }, []);
  const _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    Platform.OS === "web"
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error);
  };

  const _handleFinishLoading = () => {
    //don't update if component is unmounted
    //console.log("in handlefinishloading with current", isMounted.current);
    //if (isMounted.current === true) {
    Sentry.Native.captureMessage(
      "finish loading and will set loading complete to true"
    );

    setIfLoadingComplete(true);
    //}
  };
  if (!ifLoadingComplete) {
    return (
      <AppLoading
        startAsync={loadAssetsAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
        autoHideSplash={true}
      />
    );
  }

  return (
    <PersistGate
      loading={<ActivityIndicator debug="app.js" />}
      persistor={persistor}
    >
      <BoardContextProvider
        size={boxSize}
        playSound={playSoundMemo}
        timeout={timeout}
      >
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </BoardContextProvider>
    </PersistGate>
  );
};

const ConnectedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default ConnectedApp;
// const styles = StyleSheet.create({
//   parent: {
//     flex: 1,
//     backgroundColor: "#231F20",
//   },
//   container: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     marginTop: 10,
//     fontSize: 19,
//     textAlign: "center",
//     textAlignVertical: "center",
//     letterSpacing: 0.5,
//     color: "black",
//   },
// });
