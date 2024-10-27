import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Platform,
  SafeAreaView,
} from "react-native";

import BoardCell from "components/BoardCell";
import BoardMeta from "components/BoardMeta";
import BoardAction from "components/BoardAction";
import GameLevel from "components/GameLevel";

const Board: React.FC = () => {
  const boxSize = 16;
  const window = useWindowDimensions();

  // Height should always be greater than width
  const customWidthWeb =
    window.width / 2 >= window.height / 2
      ? window.height / 2 - 5
      : window.width / 2;
  const customWidthMobile =
    window.width - 5 >= window.height / 2
      ? window.height / 2 - 5
      : window.width - 5;

  const cells = useMemo(() => {
    const localeCells = [];
    for (let i = 0; i < boxSize; i++) {
      const cell = <BoardCell key={i} position={i} />;
      localeCells.push(cell);
    }
    return localeCells;
  }, [boxSize]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            flex: 0.5,
            width: Platform.OS === "web" ? "50%" : window.width - 5,
            borderColor: "black",
            borderWidth: 1,
            justifyContent: "flex-start",
          }}
        >
          <GameLevel />
          <BoardAction />
          <BoardMeta />
        </View>
        <View
          style={[
            styles.board,
            {
              width: Platform.OS === "web" ? customWidthWeb : customWidthMobile,
            },
          ]}
        >
          {cells}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Board;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  board: {
    height: "50%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
