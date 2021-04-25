import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  useWindowDimensions,
  Platform,
} from "react-native";

import BoardCell from "components/BoardCell";
import BoardMeta from "components/BoardMeta";

import { BoardContextProvider } from "containers/boardContext";
const Board = () => {
  const [boxSize, setBoxSize] = useState(16);
  const window = useWindowDimensions();

  let cells = [];
  for (let i = 0; i < boxSize; i++) {
    const cell = <BoardCell key={i} position={i} />;
    cells.push(cell);
  }

  return (
    <BoardContextProvider size={boxSize}>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            width: Platform.OS === "web" ? "50%" : window.width - 5,
          }}
        >
          <BoardMeta />
        </View>
        <View
          style={[
            styles.board,
            { width: Platform.OS === "web" ? "50%" : window.width - 5 },
          ]}
        >
          {cells}
        </View>
      </View>
    </BoardContextProvider>
  );
};
export default Board;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",

    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  board: {
    //width: Platform.OS === "web" ? "50%" : "100%",
    //maxWidth: Platform.OS === "web" ? "50%" : "100%",
    //minHeight: "50%",
    //padding: 5,
    height: "50%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  statusBar: {
    //height: STATUSBAR_HEIGHT
  },
  appBar: {
    // backgroundColor: Colors.tintColor,
    // height: APPBAR_HEIGHT
  },
});
