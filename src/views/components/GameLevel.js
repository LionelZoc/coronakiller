import React, { useEffect, useState } from "react";
import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";

import GameResult from "components/GameResult";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Overlay } from "react-native-elements";

import WebModal from "modal-react-native-web";
import { useSelector } from "react-redux";
import { getLevelSelector } from "state/redux/selectors";
import toNumber from "lodash/toNumber";
//import { updateTimer } from "state/redux/actions";

const LEVEL_0 = "FANTASSIN";
const LEVEL_1 = "CAPITAINE";
const LEVEL_2 = "GENERAL";

export const getLevelStatus = (level) => {
  switch (level) {
    case "":
    case 1:
      return LEVEL_0;

    case 2:
      return LEVEL_1;
    case 3:
      return LEVEL_2;
    default:
  }
};
const GAMELEVEL = () => {
  //score
  // const boardContext = useBoardContextState();
  // const dimensions = useWindowDimensions();
  const level = useSelector(getLevelSelector);
  console.log("level", level);
  //timer
  //console.log("boardContext", boardContext);
  return (
    <View style={styles.container}>
      <View style={styles.scores}>
        <Text style={styles.scoreLabel}>LEVEL : </Text>
        <Text style={styles.scoreValue}>
          {toNumber(level) ? toNumber(level) : 1}
        </Text>
        <Text style={styles.levelStatus}>{getLevelStatus(level)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  },
  scores: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 10,
    alignItems: "center",
  },
  score: {
    flex: 1,
    alignItems: "center",
  },
  timer: {
    flex: 1,
  },
  scoreLabel: {
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
    textAlignVertical: "center",
    letterSpacing: 0.5,
    fontSize: 12,
    color: "black",
  },
  levelStatus: {
    marginLeft: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
    textAlignVertical: "center",
    letterSpacing: 0.5,
    fontSize: 12,
    color: "black",
  },
  scoreValue: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
  },
  countDown: {
    fontWeight: "bold",
    fontSize: 35,
    color: "black",
  },
  countDownLabel: {
    fontWeight: "normal",
    fontSize: 20,
    color: "black",
  },
});

export default GAMELEVEL;
