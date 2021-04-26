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

const Timeout = ({ timeout }) => {
  const [countDown, setCountDown] = useState(timeout);
  const dispatcher = useBoardContextDispatcher();
  const boardContext = useBoardContextState();

  //let progressValue
  useEffect(() => {
    if (countDown > 0 && !boardContext.finished) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (countDown === 0) {
      dispatcher({ type: "TIMEOUT" });
    }
  }, [timeout, countDown, dispatcher, boardContext.finished]);

  useEffect(() => {
    //todo reset timer on restart
    if (boardContext.finished) {
      setCountDown(timeout);
    }
  }, [boardContext.finished, timeout]);

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.countDownLabel}>remaining time</Text>
      <Text style={styles.countDown}>{countDown}</Text>
    </View>
  );
};
Timeout.propTypes = {
  timeout: PropTypes.number,
};
const BoardMeta = () => {
  //score
  const boardContext = useBoardContextState();
  const dimensions = useWindowDimensions();
  //timer
  //console.log("boardContext", boardContext);
  return (
    <View style={styles.container}>
      <View style={styles.score}>
        <Text style={styles.scoreLabel}>SCORE : </Text>
        <Text style={styles.scoreValue}>{boardContext.score}</Text>
      </View>
      <View style={styles.timer}>
        <Timeout timeout={boardContext.timeout} />
      </View>
      <Overlay
        ModalComponent={Platform.OS === "web" ? WebModal : Modal}
        fullscreen
        isVisible={boardContext.finished}
        overlayStyle={[
          styles.overlayStyle,
          { height: dimensions.height - 50, width: dimensions.width - 50 },
        ]}
      >
        <GameResult />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
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
  },
  scoreValue: {
    fontWeight: "bold",
    fontSize: 40,
  },
  countDown: {
    fontWeight: "bold",
    fontSize: 35,
  },
  countDownLabel: {
    fontWeight: "normal",
    fontSize: 20,
  },
});

export default BoardMeta;
