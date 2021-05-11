import React, { useEffect, useCallback } from "react";
import { Button } from "react-native-elements";
//import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { getHighScoreSelector, getLevelSelector } from "state/redux/selectors";
import { updateGameHighScore, upgradeLevel } from "state/redux/actions";
import { onShare } from "utils";
import toNumber from "lodash/toNumber";
import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";
import { getLevelStatus } from "components/GameLevel";
const getRank = (score, totalPlayTime) => {
  const targetPerSecond = score / totalPlayTime;
  if (targetPerSecond > 4.1) return "S";
  if (targetPerSecond > 4) return "A";
  if (targetPerSecond > 3) return "B";
  if (targetPerSecond > 2) return "C";
  return "D";
};
const GameResult = () => {
  const boardContext = useBoardContextState();
  const dispatcher = useBoardContextDispatcher();
  const reduxDispatch = useDispatch();
  const highScore = useSelector(getHighScoreSelector);
  const level = useSelector(getLevelSelector);
  const onUpgradeLevel = useCallback(() => {
    reduxDispatch(upgradeLevel(level));
    dispatcher({ type: "RESTART" });
  }, [level]);
  useEffect(() => {
    if (boardContext.score > highScore) {
      reduxDispatch(updateGameHighScore(boardContext.score));
    }
  }, [highScore, boardContext.score, reduxDispatch]);
  const restart = () => {
    dispatcher({ type: "RESTART" });
  };
  const targetPerSecond = boardContext.score / boardContext.totalPlayTime;

  return (
    <View style={styles.container}>
      <View style={styles.score}>
        <Text style={styles.highScoreLabel}>Highest Score : {highScore} </Text>
        <Text style={styles.scoreLabel}>Score : {boardContext.score} </Text>
        <Text style={styles.scoreLabel}>Level : {getLevelStatus(level)} </Text>

        <Text style={styles.rankLabel}>
          Rank : {getRank(boardContext.score, boardContext.totalPlayTime)}{" "}
        </Text>
      </View>
      <View style={styles.action}>
        <Button
          title="Restart"
          titleStyle={{ fontWeight: "bold", fontSize: 18, marginLeft: 10 }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 20,
          }}
          containerStyle={{
            width: "70%",
            maxWidth: 300,
          }}
          icon={
            <Icon
              name="restart"
              type="material-community"
              size={30}
              color="white"
            />
          }
          onPress={restart}
        />
        <Button
          title="Share"
          titleStyle={{ fontWeight: "bold", fontSize: 18, marginLeft: 10 }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 20,
          }}
          containerStyle={{
            marginTop: 10,
            width: "70%",
            maxWidth: 300,
          }}
          icon={
            <Icon
              name="share-variant"
              type="material-community"
              size={30}
              color="white"
            />
          }
          onPress={() => onShare(highScore, level)}
        />
        <Button
          title={`Go to Level ${toNumber(level) ? toNumber(level) + 1 : 2}`}
          titleStyle={{ fontWeight: "bold", fontSize: 18, marginLeft: 10 }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 20,
            backgroundColor: "green",
          }}
          containerStyle={{
            marginTop: 30,
            width: "70%",
            maxWidth: 300,
            display: targetPerSecond > 4 ? "flex" : "none",
          }}
          icon={
            <Icon
              name="skip-next"
              type="material-community"
              size={30}
              color="white"
            />
          }
          onPress={() => onUpgradeLevel()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "94%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    flex: 1,
    justifyContent: "flex-end",
  },
  highScoreLabel: {
    fontWeight: "bold",
    fontSize: 30,
    color: "black",
    marginBottom: 30,
  },
  scoreLabel: {
    fontWeight: "bold",
    fontSize: 30,
    color: "black",
    marginBottom: 10,
  },
  levelLabel: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    marginBottom: 10,
  },
  rankLabel: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 35,
    color: "black",
  },
  action: {
    paddingTop: 30,
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});

export default GameResult;
