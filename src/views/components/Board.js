import React, { useMemo } from "react";
import { StyleSheet, View, useWindowDimensions, Platform } from "react-native";

import BoardCell from "components/BoardCell";
import BoardMeta from "components/BoardMeta";
import BoardAction from "components/BoardAction";
import GameLevel from "components/GameLevel";
import Parent from "components/ParentView";
//import PropTypes from "prop-types";

const Board = () => {
  const boxSize = 16;
  //const [missSound, setMissSound] = useState();
  const window = useWindowDimensions();

  //height should always be sup to width
  const customWidthWeb =
    window.width / 2 >= window.height / 2
      ? window.height / 2 - 5
      : window.width / 2;
  const customWidthMobile =
    window.width - 5 >= window.height / 2
      ? window.height / 2 - 5
      : window.width - 5;
  let cells = [];
  cells = useMemo(() => {
    const localeCells = [];
    for (let i = 0; i < boxSize; i++) {
      const cell = <BoardCell key={i} position={i} />;
      localeCells.push(cell);
    }
    return localeCells;
  }, [boxSize]);

  // useEffect(() => {
  //   return missSound
  //     ? () => {
  //         missSound.unloadAsync();
  //       }
  //     : undefined;
  // }, [missSound]);

  return (
    <Parent>
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
    </Parent>
  );
};
Board.propTypes = {};
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
