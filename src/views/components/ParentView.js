import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);
MyStatusBar.propTypes = {
  backgroundColor: PropTypes.string,
};

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const Parent = ({ children }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.parent}>
      <SafeAreaView style={{ flex: 1 }}>
        <MyStatusBar />
        <View style={styles.navigationHeader}>
          <Icon
            name="menu"
            color="#517fa4"
            onPress={() => navigation.openDrawer()}
          />
        </View>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </View>
  );
};
Parent.propTypes = {
  children: PropTypes.element,
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "#231F20",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  navigationHeader: {
    flexDirection: "row",

    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
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

export default Parent;
