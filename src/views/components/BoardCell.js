import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import virus from "assets/target.png";
import mask from "assets/mask.png";
import {
  useBoardContextState,
  useBoardContextDispatcher,
  useCellState,
  useClickTarget,
  useMissBonus,
  useClickBonus,
  useMissTarget,
} from "containers/boardContext";
import Colors from "constants/Colors";

const BoardCell = ({ position }) => {
  const boardContext = useBoardContextState();
  const boarCellState = useCellState(position);
  const dispatcher = useBoardContextDispatcher();
  const window = useWindowDimensions();

  const clickTarget = useClickTarget(position);
  const missBonus = useMissBonus(position);
  const clickBonus = useClickBonus(position);
  const missTarget = useMissTarget(position);

  //height should always be sup to width
  const customWidthWeb =
    window.width / 2 >= window.height / 2
      ? window.height / 2 - 5
      : window.width / 2;
  const customWidthMobile =
    window.width - 5 >= window.height / 2
      ? window.height / 2 - 5
      : window.width - 5;
  const cellSize =
    Platform.OS === "web"
      ? customWidthWeb / Math.sqrt(boardContext.size)
      : customWidthMobile / Math.sqrt(boardContext.size);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (boarCellState.showBonus) {
        missBonus();
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [boarCellState.showBonus, dispatcher, position, missBonus]);

  return useMemo(() => {
    return (
      <View
        style={[
          styles.container,
          {
            width: cellSize,
            height: cellSize,
          },
        ]}
      >
        {!boarCellState.show && !boarCellState.showBonus && (
          <TouchableOpacity
            onPress={missTarget}
            style={{ width: "100%", height: "100%" }}
          />
        )}
        {boarCellState.show && (
          <Image
            source={virus}
            containerStyle={[
              styles.imageContainer,
              {
                width: cellSize / 2,
                height: cellSize / 2,
              },
            ]}
            onPress={clickTarget}
          />
        )}
        {boarCellState.showBonus && (
          <Image
            source={mask}
            containerStyle={[
              styles.imageBonusContainer,
              {
                width: cellSize / 2,
                height: cellSize / 2,
              },
            ]}
            onPress={clickBonus}
          />
        )}
      </View>
    );
  }, [
    cellSize,
    boarCellState.show,
    boarCellState.showBonus,
    clickTarget,
    clickBonus,
    missTarget,
  ]);
};

BoardCell.propTypes = {
  position: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cellBorder,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  imageBonusContainer: {
    // width: 100,
    // height: 100,
  },
});

export default BoardCell;
