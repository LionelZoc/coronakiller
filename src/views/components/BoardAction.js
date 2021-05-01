import React, { useEffect, useState } from "react";
import {
  useBoardContextState,
  useBoardContextDispatcher,
} from "containers/boardContext";

import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  //Platform,
} from "react-native";
import { Button, Icon } from "react-native-elements";

const BoarAction = () => {
  const boardContext = useBoardContextState();
  const dispatcher = useBoardContextDispatcher();
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
    <View style={[styles.containerr]}>
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
            width: 200,
            maxWidth: 300,
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
    </View>
  );
};

BoarAction.propTypes = {};
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
});

export default BoarAction;
