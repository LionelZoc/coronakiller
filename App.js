import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import PropTypes from "prop-types";
import Board from "components/Board.js";
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
import { getLocaleSelector } from "state/redux/selectors";
// import { FormattedMessage, useIntl } from "react-intl";

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

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);
MyStatusBar.propTypes = {
  backgroundColor: PropTypes.string,
};

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

const App = () => {
  //const intl = useIntl();
  //const locale = useSelector(getLocaleSelector);
  const [ifLoadingComplete, setIfLoadingComplete] = useState(false);
  const isMounted = useRef(false);
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
    ]);

    await Promise.all([...imageAssets]);
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
    //console.warn(error);
  };

  const _handleFinishLoading = () => {
    //don't update if component is unmounted
    //console.log("in handlefinishloading with current", isMounted.current);
    if (isMounted.current === true) {
      setIfLoadingComplete(true);
    }
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MyStatusBar />

          <Board />
        </View>
      </SafeAreaView>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  title: {
    marginTop: 10,
    fontSize: 19,
    textAlign: "center",
    textAlignVertical: "center",
    letterSpacing: 0.5,
    color: "black",
  },
});
