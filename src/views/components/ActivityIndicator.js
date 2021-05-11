import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
//import messages from "../screens/messages";
//import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

const GameActivityIndicator = ({
  style = {},
  debug,
  transparent,
  color,
  canTimeout = false,
  ...rest
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const window = useWindowDimensions();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTimeout(true);
      //Alert.alert("dude wtf");
    }, 8000);
    return () => {
      //console.log("clearing getItemLayout");
      clearTimeout(timeout);
    };
  }, []);
  if (debug) {
    //console.log("ActivityIndicator from ", debug);
  }
  if (showTimeout && canTimeout) {
    return null;
    // return (
    //   <Text style={{ color: "black", fontWeight: "bold" }}>
    //     {timeoutMsg ? (
    //       timeoutMsg
    //     ) : (
    //       <FormattedMessage {...messages.activityIndicatorTimeoutMessage} />
    //     )}
    //   </Text>
    // );
  }

  return (
    <View
      style={[
        styles.container,
        style,
        transparent ? { backgroundColor: "transparent" } : {},
        { width: window.width, height: window.height },
      ]}
      {...rest}
    >
      <ActivityIndicator
        animating={true}
        size="large"
        color={color ? color : "#EB8B33"}
      />
    </View>
  );
};
GameActivityIndicator.propTypes = {
  style: PropTypes.object,
  debug: PropTypes.string,
  transparent: PropTypes.bool,
  color: PropTypes.string,
  timeoutMsg: PropTypes.string,
  canTimeout: PropTypes.bool,
};
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "transparent",
  },
});

export default GameActivityIndicator;
