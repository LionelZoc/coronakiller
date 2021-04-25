import React, { useEffect, useState } from "react";
import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";
import Colors from "constants/Colors";
import PropTypes from "prop-types";
import { StyleSheet, View, Platform, Text } from "react-native";
import { Image } from "react-native-elements";

const Timeout = ({ timeout }) => {
  const [countDown, setCountDown] = useState(timeout);
  const dispatcher = useBoardContextDispatcher();
  //let progressValue
  useEffect(() => {
    if (countDown > 0) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (countDown === 0) {
      dispatcher({ type: "TIMEOUT" });
    }
  }, [timeout, countDown, dispatcher]);

  // const infos = [
  //   {
  //     label: "hours",
  //     value: countDown.hours.toLocaleString("fr-fr", {
  //       minimumIntegerDigits: 2,
  //       useGrouping: false,
  //     }),
  //     hide:
  //       (countDown.days === 0 && countDown.hours === 0) || countDown.isExpired,
  //   },
  //   {
  //     label: "minutes",
  //     value: countDown.minutes.toLocaleString("fr-fr", {
  //       minimumIntegerDigits: 2,
  //       useGrouping: false,
  //     }),
  //     hide:
  //       countDown.days === 0 &&
  //       countDown.hours === 0 &&
  //       countDown.minutes === 0,
  //   },
  //   {
  //     label: "seconds",
  //     value: countDown.seconds.toLocaleString("fr-fr", {
  //       minimumIntegerDigits: 2,
  //       useGrouping: false,
  //     }),
  //   },
  // ];

  return (
    <View>
      <Text>{countDown}</Text>
    </View>
  );
};
Timeout.propTypes = {};
const BoardMeta = ({}) => {
  //score
  const boardContext = useBoardContextState();
  //timer
  return (
    <View style={styles.container}>
      <View style={styles.score}>
        <Text>score : {boardContext.score} </Text>
      </View>
      <View style={styles.timer}>
        <Timeout timeout={120} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-beetwen",
    alignItems: "center",
    flex: 1,
  },
  score: {
    flex: 1,
  },
  timer: {
    flex: 1,
  },
});

export default BoardMeta;
