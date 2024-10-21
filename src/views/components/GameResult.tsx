import React, { useEffect, useCallback, useState } from "react";
import { Button, Icon, Overlay } from "react-native-elements";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Platform,
  useWindowDimensions,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
  getHighScoreSelector,
  getLevelSelector,
  getHighestLevelSelector,
  getHighestScorePlaytimeSelector,
} from "state/redux/selectors";
import {
  updateGameHighScore,
  upgradeLevel,
  updateBestScore,
} from "state/redux/actions";
import {
  onShare,
  getRank,
  getRankValue,
  NEXT_LEVEL_THRESHOLD,
  isScoreBetter,
} from "utils";
import toNumber from "lodash/toNumber";
import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";
import { getLevelStatus } from "components/GameLevel";
import { getHumanizeTime } from "utils/date";
import GameHelp from "components/GameHelp";
import WebModal from "modal-react-native-web";
import { isLoaded, isEmpty } from "react-redux-firebase";

const GameResult = () => {
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firestore.profile);
  const boardContext = useBoardContextState();
  const dispatcher = useBoardContextDispatcher();
  const reduxDispatch = useDispatch();
  const highScore = useSelector(getHighScoreSelector);
  const level = useSelector(getLevelSelector);
  const highScoreLevel = useSelector(getHighestLevelSelector);
  const highScorePlaytime = useSelector(getHighestScorePlaytimeSelector);
  const dimensions = useWindowDimensions();
  const [showHelp, setShowHelp] = useState(false);

  const targetPerSecond = boardContext.score / boardContext.totalPlayTime;
  const duration = getHumanizeTime(boardContext.totalPlayTime);

  const onUpgradeLevel = useCallback(() => {
    reduxDispatch(upgradeLevel(level));
    dispatcher({ type: "RESTART" });
  }, [level]);
  useEffect(() => {
    const newScore = {
      score: boardContext.score,
      playtime: boardContext.totalPlayTime,
      level,
    };
    const oldScore = {
      score: highScore,
      playtime: highScorePlaytime,
      level: highScoreLevel,
    };
    //boardContext.score > highScore
    if (isScoreBetter({ newScore, oldScore })) {
      reduxDispatch(
        updateGameHighScore({
          score: boardContext.score,
          playTime: boardContext.totalPlayTime,
          level,
        }),
      );
      if (!isEmpty(auth) && !isEmpty(profile))
        reduxDispatch(
          updateBestScore({
            level,
            value: boardContext.score,
            kps: targetPerSecond,
            userId: auth.id,
            force: true,
            username: profile.name,
            rank: getRankValue({
              score: highScore,
              totalPlayTime: boardContext.totalPlayTime,
            }),
            playTime: boardContext.totalPlayTime,
          }),
        );
    }
  }, [highScore, boardContext.score, reduxDispatch, auth, profile]);
  const restart = () => {
    dispatcher({ type: "RESTART" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.score}>
        <Text style={styles.highScoreLabel}>Highest Score : {highScore} </Text>
        <Text style={styles.highScoreLabel}>
          {`Duration : ${boardContext.totalPlayTime}s`}
        </Text>
        <Text style={styles.scoreLabel}>Score : {boardContext.score} </Text>
        <Text style={styles.scoreLabel}>Level : {getLevelStatus(level)} </Text>

        <Text style={styles.rankLabel}>
          Rank :{" "}
          {getRank({
            score: boardContext.score,
            totalPlayTime: boardContext.totalPlayTime,
          })}{" "}
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
            display: targetPerSecond >= NEXT_LEVEL_THRESHOLD ? "flex" : "none",
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
        <Button
          title={"Help"}
          titleStyle={{ fontWeight: "bold", fontSize: 18, marginLeft: 10 }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 20,
            backgroundColor: "#246EE9",
          }}
          containerStyle={{
            marginTop: 30,
            width: "70%",
            maxWidth: 300,
            display: targetPerSecond >= 0 ? "flex" : "none",
          }}
          icon={
            <Icon
              name="help-circle-outline"
              type="material-community"
              size={30}
              color="white"
            />
          }
          onPress={() => setShowHelp(true)}
        />
        <Overlay
          ModalComponent={Platform.OS === "web" ? WebModal : Modal}
          fullscreen
          isVisible={showHelp}
          overlayStyle={[
            styles.overlayStyle,
            { height: dimensions.height - 150, width: dimensions.width - 50 },
          ]}
        >
          <GameHelp onSkip={() => setShowHelp(false)} />
        </Overlay>
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
    marginBottom: 10,
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
