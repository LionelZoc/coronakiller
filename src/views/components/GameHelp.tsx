import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";

interface GameHelpProps {
  onSkip?: () => void;
}

const GameHelp: React.FC<GameHelpProps> = ({ onSkip }) => {
  return (
    <View style={[styles.container]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.description}>
          Pour passer au niveau suivant écrasez au moins 4 cibles par seconde.
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Button
          title={"Ok"}
          titleStyle={{ fontWeight: "bold", fontSize: 18, marginLeft: 10 }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 20,
            backgroundColor: "#246EE9",
          }}
          containerStyle={{
            marginTop: 30,
            width: "100%",
            display: "flex",
          }}
          onPress={onSkip}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 20,
  },
  description: {
    fontWeight: "bold",
    textAlign: "left",
    textAlignVertical: "center",
    letterSpacing: 0.5,
    fontSize: 25,
    color: "black",
  },
});

export default GameHelp;
