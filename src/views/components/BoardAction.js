import React, { useCallback } from "react";
import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";

import { useSelector, useDispatch } from "react-redux";
import {
  getHighScoreSelector,
  getSoundOnSelector,
} from "state/redux/selectors";
import {
  StyleSheet,
  View,
  //Platform,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { onShare } from "utils";
import { toggleSound } from "state/redux/actions";
import { getLevelSelector } from "state/redux/selectors";

const BoarAction = () => {
  const boardContext = useBoardContextState();
  const dispatcher = useBoardContextDispatcher();
  const highScore = useSelector(getHighScoreSelector);
  const soundOn = useSelector(getSoundOnSelector);
  const level = useSelector(getLevelSelector);
  const reduxDispatch = useDispatch();

  const toggleSoundOn = useCallback(() => {
    reduxDispatch(toggleSound());
  }, [reduxDispatch]);

  const restart = () => {
    if (boardContext.started) {
      dispatcher({ type: "STOP" });
      dispatcher({ type: "START" });
    } else {
      dispatcher({ type: "START" });
    }
  };
  //// TODO: fix restart
  return (
    <View style={[styles.container]}>
      {!boardContext.started && (
        <Button
          title={boardContext.started ? "Restart" : "Start"}
          titleStyle={{ fontWeight: "bold", fontSize: 18 }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 20,
          }}
          containerStyle={{
            width: 150,
            maxWidth: 200,
          }}
          icon={
            <Icon
              name={boardContext.started ? "restart" : "play-circle"}
              type="material-community"
              size={30}
              color="white"
            />
          }
          onPress={restart}
        />
      )}
      <Button
        buttonStyle={{
          borderWidth: 0,
          borderColor: "transparent",
          borderRadius: 20,
        }}
        containerStyle={{
          marginLeft: 10,
          width: 70,
          maxWidth: 100,
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
        buttonStyle={{
          borderWidth: 0,
          borderColor: "transparent",
          borderRadius: 20,
        }}
        containerStyle={{
          marginLeft: 10,
          width: 70,
          maxWidth: 100,
        }}
        icon={
          <Icon
            name={soundOn ? "sound" : "sound-mute"}
            type="entypo"
            size={30}
            color="white"
          />
        }
        onPress={toggleSoundOn}
      />
    </View>
  );
};

BoarAction.propTypes = {};
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BoarAction;
