import React from "react";
import { Text, StyleSheet, View, SafeAreaView, Platform } from "react-native";
import PropTypes from "prop-types";
import BoardCell from "components/BoardCell";
import Colors from "constants/Colors";

const Board = () => {
  const boxSize = 16;
  let cells = [];
  for (let i = 0; i < boxSize; i++) {
    const cell = <BoardCell />;
    cells.push(cell);
  }

  return (
    <View style={styles.container}>
      <View style={styles.board}>{cells}</View>
    </View>
  );
};
export default Board;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "blue",

    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  board: {
    width: "50%",
    maxWidth: "50%",
    minHeight: "50%",
    padding: 50,
    height: "auto",
    backgroundColor: "yellow",
    borderWidth: 1,
    borderColor: Colors.cellBorder,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBar: {
    //height: STATUSBAR_HEIGHT
  },
  appBar: {
    // backgroundColor: Colors.tintColor,
    // height: APPBAR_HEIGHT
  },
});
