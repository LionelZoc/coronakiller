import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions, Platform } from "react-native";

import BoardCell from "components/BoardCell";
import BoardMeta from "components/BoardMeta";
import BoardAction from "components/BoardAction";
import { Audio } from "expo-av";
import impactSound from "assets/impact.mp3";
//import failSound from "assets/fail.mp3";
import { BoardContextProvider } from "containers/boardContext";
import * as Sentry from "sentry-expo";
import GameLevel from "components/GameLevel";
import { getSoundOnSelector } from "state/redux/selectors";
import { useSelector } from "react-redux";

const Board = () => {
  const [boxSize, setBoxSize] = useState(16);
  const [timeout, setTimeout] = useState(60);
  const [error, setError] = useState(false);
  const [sound, setSound] = useState();
  const soundOn = useSelector(getSoundOnSelector);
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

  useEffect(() => {
    try {
      const initAudio = async () =>
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
        });
      initAudio();
      const load = async () => {
        //init sound

        const { sound } = await Audio.Sound.createAsync(impactSound, {
          shouldPlay: false,
        });
        // const { missSound } = await Audio.Sound.createAsync(failSound, {
        //   shouldPlay: false,
        // });
        setSound(sound);
        //setMissSound(missSound);
      };
      load();
    } catch (e) {
      setError(true);
      Platform.OS === "web"
        ? Sentry.Browser.captureException(e)
        : Sentry.Native.captureException(e);
    }
  }, []);

  const playSoundMemo = useCallback(
    (type = "hit") => {
      const playSound = async () => {
        //await sound.replayAsync({positionMillis: 0, shouldPlay: true})
        //await sound.setStatusAsync({positionMillis: 0, shouldPlay: true})
        if (type === "hit") {
          await sound.stopAsync();
          await sound.playAsync();
        } else {
          //await missSound.stopAsync();
          //await missSound.playAsync();
        }
      };
      if (soundOn) playSound(type);
    },
    [sound, soundOn]
  );

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // useEffect(() => {
  //   return missSound
  //     ? () => {
  //         missSound.unloadAsync();
  //       }
  //     : undefined;
  // }, [missSound]);

  return (
    <BoardContextProvider
      size={boxSize}
      playSound={playSoundMemo}
      timeout={timeout}
    >
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
    </BoardContextProvider>
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
