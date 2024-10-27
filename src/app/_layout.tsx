import { useState, useCallback, useEffect, useRef } from "react";
import { Slot } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Provider, useSelector } from "react-redux";
import { Settings } from "react-native-fbsdk-next";
import { ReactReduxFirebaseProvider, isLoaded } from "react-redux-firebase";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { PersistGate } from "redux-persist/integration/react";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";

import configureStore from "state/redux/configureStore";
import { Sounds } from "@/assets/index";
//import failSound from "assets/fail.mp3";
import { BoardContextProvider } from "containers/boardContext";
import { getSoundOnSelector } from "state/redux/selectors";
//import ImageAsset, { Sounds } from "assets";
import ActivityIndicator from "components/ActivityIndicator";
import { playSound, SoundType, SOUND_TYPES } from "utils/sound";
import { ThemeProvider } from "theme/themeProvider";

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
      // ...
    }),
  ],
});

//configure redux store
let { store, persistor, rrfProps } = configureStore();

const RootLayout = () => {
  const auth = useSelector((state) => state.firebase.auth);
  console.log("in root layout");
  useEffect(() => {
    console.log("auth changed", auth);
  }, [auth]);

  const isMounted = useRef(false);
  const [boxSize, setBoxSize] = useState(16);
  const [timeout, setTimeout] = useState(60);
  const [error, setError] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const soundOn = useSelector(getSoundOnSelector);

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      // Ask for consent first if necessary
      // Possibly only do this for iOS if no need to handle a GDPR-type flow
      Settings.initializeSDK();
      if (status === "granted") {
        //        console.log("Yay! I have user permission to track data");
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      const initAudio = async () =>
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
        });
      initAudio();
      const load = async () => {
        //init sound

        const { sound } = await Audio.Sound.createAsync(Sounds.impact, {
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
      Sentry.captureException(e);
      //   Platform.OS === "web"
      //     ? Sentry.Browser.captureException(e)
      //     : Sentry.captureException(e);
    }
  }, []);

  const playSoundMemo = useCallback(
    (type: SoundType = SOUND_TYPES.HIT) => {
      playSound(type, soundOn, sound);
    },
    [sound, soundOn],
  );

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      //console.log("unmounting app with current", isMounted.current);
    };
  }, []);

  return (
    <PersistGate
      loading={<ActivityIndicator debug="app.js" color="black" />}
      persistor={persistor}
    >
      <ReactReduxFirebaseProvider {...rrfProps}>
        <BoardContextProvider
          size={boxSize}
          playSound={playSoundMemo}
          timeout={timeout}
        >
          <ThemeProvider>
            <Slot />
          </ThemeProvider>
        </BoardContextProvider>
      </ReactReduxFirebaseProvider>
    </PersistGate>
  );
};

const ConnectedApp = () => {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
};
// Wrap the Root Layout route component with `Sentry.wrap` to capture gesture info and profiling data.
export default Sentry.wrap(ConnectedApp);
