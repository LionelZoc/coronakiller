import React from "react";
import { Button } from "react-native-elements";
//import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";

import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";
const getRank = (score) => {
  if (score > 200) return "S";
  if (score > 160) return "A";
  if (score > 150) return "B";
  if (score > 100) return "C";
  return "D";
};
const GameResult = () => {
  const boardContext = useBoardContextState();
  const dispatcher = useBoardContextDispatcher();
  const restart = () => {
    dispatcher({ type: "RESTART" });
  };
  return (
    <View style={styles.container}>
      <View style={styles.score}>
        <Text style={styles.scoreLabel}>Score : {boardContext.score} </Text>
        <Text style={styles.rankLabel}>
          Rank : {getRank(boardContext.score)}{" "}
        </Text>
      </View>
      <View style={styles.action}>
        <Button
          title="restart"
          titleStyle={{ fontWeight: "bold", fontSize: 18 }}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scoreLabel: {
    fontWeight: "bold",
    fontSize: 35,
    color: "black",
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
