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
import { useSelector, useDispatch } from "react-redux";
import { getHighScoreSelector } from "state/redux/selectors";
import { updateTimer } from "state/redux/actions";

const Timeout = ({ timeout }) => {
  const [countDown, setCountDown] = useState(timeout);
  const dispatcher = useBoardContextDispatcher();
  const boardContext = useBoardContextState();
  const reduxDispatch = useDispatch();

  useEffect(() => {
    if (boardContext.incrementTimeout && boardContext.started) {
      setCountDown(countDown + 10);
      reduxDispatch(updateTimer(countDown + 10));
      dispatcher({ type: "TIMEOUT_INCREMENTED" });
    }
  }, [boardContext.incrementTimeout, dispatcher, boardContext.started]);
  //let progressValue
  useEffect(() => {
    if (countDown > 0 && !boardContext.finished && boardContext.started) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1);
        reduxDispatch(updateTimer(countDown - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
    if (countDown === 0 && boardContext.started) {
      dispatcher({ type: "TIMEOUT" });
    }
    if (!boardContext.started) {
      setCountDown(timeout);
    }
  }, [
    timeout,
    countDown,
    dispatcher,
    boardContext.finished,
    boardContext.started,
  ]);

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
  const highScore = useSelector(getHighScoreSelector);

  //timer
  //console.log("boardContext", boardContext);
  return (
    <View style={styles.container}>
      <View style={styles.scores}>
        <View style={styles.score}>
          <Text style={styles.scoreLabel}>SCORE : </Text>
          <Text style={styles.scoreValue}>{boardContext.score}</Text>
        </View>
        <View style={styles.score}>
          <Text style={styles.scoreLabel}>HIGH SCORE : </Text>
          <Text style={styles.scoreValue}>{highScore}</Text>
        </View>
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
          { height: dimensions.height - 200, width: dimensions.width - 50 },
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
  scores: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  score: {
    flex: 1,
    alignItems: "center",
  },
  timer: {
    flex: 1,
  },
  scoreLabel: {
    fontWeight: "normal",
    textTransform: "uppercase",
    textAlign: "left",
    textAlignVertical: "center",
    letterSpacing: 0.5,
    fontSize: 12,
    color: "black",
  },
  scoreValue: {
    fontWeight: "bold",
    fontSize: 30,
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

export default BoardMeta;
