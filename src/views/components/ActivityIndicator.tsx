import React, { useEffect, useState, FC } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
} from "react-native";
//import messages from "../screens/messages";
//import { FormattedMessage } from "react-intl";

interface GameActivityIndicatorProps {
  style?: StyleProp<ViewStyle>;
  debug?: string;
  transparent?: boolean;
  color?: string;
  timeoutMsg?: string;
  canTimeout?: boolean;
  [key: string]: any; // Allow for any other props passed
}

const GameActivityIndicator: FC<GameActivityIndicatorProps> = ({
  style = {},
  debug,
  transparent,
  color,
  canTimeout = false,
  ...rest
}) => {
  console.log("in activity indicator", debug);
  const [showTimeout, setShowTimeout] = useState(false);
  const window = useWindowDimensions();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTimeout(true);
    }, 8000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (debug) {
    // console.log("ActivityIndicator from ", debug);
  }

  if (showTimeout && canTimeout) {
    return null;
    // Uncomment below if you want to show a timeout message
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "transparent",
  },
});

export default GameActivityIndicator;
