import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  SafeAreaView,
  // useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Colors from "constants/Colors";
import { Icon } from "react-native-elements";
import { Image } from "expo-image";
import { IMPORTED_IMAGES_NAMES } from "@/assets/index";
import map from "lodash/map";
import { useSelector, useDispatch } from "react-redux";
import { getTargetSelectedSelector } from "state/redux/selectors";
import { updateGameTarget } from "state/redux/actions";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useBoardContextDispatcher } from "containers/boardContext";
import ROUTES from "constants/routes";
import { targetType } from "constants/game";

type targetsType = {
  key: targetType;
  value: string;
  platform: string[];
}[];

const targets: targetsType = [
  {
    key: "insect",
    value: IMPORTED_IMAGES_NAMES.insect,
    platform: ["android", "ios"],
  },
  {
    key: "bug",
    value: IMPORTED_IMAGES_NAMES.bug,
    platform: ["android", "ios"],
  },
  {
    key: "spider",
    value: IMPORTED_IMAGES_NAMES.spider,
    platform: ["android", "ios"],
  },
  {
    key: "virus",
    value: IMPORTED_IMAGES_NAMES.virus,
    platform: ["android", "ios"],
  },
];
const BoardTargetSelection = () => {
  const dispatch = useDispatch();
  const selectedTarget = useSelector(getTargetSelectedSelector);
  const navigation = useNavigation();
  const dispatcher = useBoardContextDispatcher();

  const chooseTarget = (key) => {
    dispatch(updateGameTarget(key));
    dispatcher({ type: "STOP" });
    navigation.dispatch(DrawerActions.jumpTo(ROUTES.BOARD.relativePath));

    //if (onSkip) onSkip();
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
      >
        <View style={styles.textContent}>
          <Text style={styles.label}> Choisissez une cible</Text>
        </View>
        <View style={styles.images}>
          {map(targets, (target) => {
            if (target.platform.includes(Platform.OS)) {
              return (
                <TouchableOpacity
                  style={styles.block}
                  key={target.key}
                  onPress={() => chooseTarget(target.key)}
                >
                  <Image
                    source={target.value}
                    style={[styles.imageContainer]}
                  />
                  {selectedTarget === target && (
                    <View style={styles.selected}>
                      <Icon name="check" type="entypo" color="#517fa4" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            } else return null;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingHorizontal: 10,
    //width: "100%",
    //borderColor: Colors.cellBorder,
  },
  textContent: {
    paddingVertical: 2, //use theme spacing later
    justifyContent: "center",
  },
  images: {
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  imageContainer: {
    width: 100, //take from theme
    height: 100,
  },
  imageBonusContainer: {
    // width: 100,
    // height: 100,
  },
  block: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cellBorder,
    marginBottom: 10,
  },
  selected: {
    position: "absolute",
    top: "50%",
    bottom: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 30,
    color: "black",
    marginBottom: 30,
  },
});

export default BoardTargetSelection;
