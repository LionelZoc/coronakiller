import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import virus from "assets/coronavirus.png";

//usecontext
const BoardCell = () => {
  const onClick = () => {
    //callback that send yes to parent from context
  };
  return (
    <View style={styles.container}>
      <Image
        source={virus}
        containerStyle={styles.imageContainer}
        onPress={onClick}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 2,
    width: 100,
    height: 100,
    flexDirection: "column",
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
});

export default BoardCell;
