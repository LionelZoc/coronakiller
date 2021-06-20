import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  // useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Colors from "constants/Colors";
import { Image, Icon } from "react-native-elements";
import virus from "assets/target.png";
import bug from "assets/targetBug.png";
import insect from "assets/targetInsect.png";
import spider from "assets/targetSpider.png";
import map from "lodash/map";
import { useSelector, useDispatch } from "react-redux";
import { getTargetSelectedSelector } from "state/redux/selectors";
import { updateGameTarget } from "state/redux/actions";

//  { key: "virus", value: virus, platform: "android" },
const targets = [
  { key: "insect", value: insect, platform: ["android", "ios"] },
  { key: "bug", value: bug, platform: ["android", "ios"] },
  { key: "spider", value: spider, platform: ["android", "ios"] },
  { key: "virus", value: virus, platform: ["android"] },
];
const BoardTargetSelection = ({ onSkip }) => {
  const dispatch = useDispatch();
  const selectedTarget = useSelector(getTargetSelectedSelector);
  const chooseTarget = (key) => {
    dispatch(updateGameTarget(key));
    if (onSkip) onSkip();
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <Text style={styles.label}> Choisissez une cible</Text>
      </View>
      <View style={styles.images}>
        {map(targets, (target) => {
          if (target.platform.includes(Platform.OS)) {
            return (
              <TouchableOpacity style={styles.block} key={target.key}>
                <Image
                  source={target.value}
                  containerStyle={[styles.imageContainer]}
                  onPress={() => chooseTarget(target.key)}
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
    </View>
  );
};

BoardTargetSelection.propTypes = {
  position: PropTypes.number,
  onSkip: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingHorizontal: 10,
    width: "100%",
    //borderColor: Colors.cellBorder,
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  images: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  imageContainer: {
    width: 100,
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
