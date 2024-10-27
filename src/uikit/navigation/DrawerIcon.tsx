import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Icon } from "react-native-elements";

const DrawerIcon = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      {/* Replace with your preferred icon */}
      <Icon
        name="game-controller"
        type="simple-line-icon"
        size={30}
        color="black"
        style={{ marginLeft: 15 }}
      />
    </TouchableOpacity>
  );
};

export default DrawerIcon;
