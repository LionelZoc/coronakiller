import React from "react";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";
import { StyleSheet, View, Platform, Text } from "react-native";
import Colors from "constants/Colors";
import { Icon } from "react-native-elements";

import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";

const GameResult = () => {
  const boardContext = useBoardContextState();
  const dispatcher = useBoardContextDispatcher();
  const restart = () => {
    dispatcher({ type: "RESTART" });
  };
  return (
    <View style={styles.container}>
      <View style={styles.score}>
        <Text>score : {boardContext.score} </Text>
      </View>
      <View style={styles.action}>
        <Button
          title="restart"
          icon={<Icon name="restart" size={15} color="white" />}
          onPress={restart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    //  borderColor: Colors.cellBorder,
  },
  score: {
    flex: 1,
  },
  action: {
    flex: 1,
  },
});

export default GameResult;
