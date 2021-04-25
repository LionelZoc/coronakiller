import React from "react";
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

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);
MyStatusBar.propTypes = {
  backgroundColor: PropTypes.string,
};

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MyStatusBar />

        <Text style={styles.title}>
          Please save the world, you are our last hope !
        </Text>

        <Board />
      </View>
    </SafeAreaView>
  );
}

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
  },
});
