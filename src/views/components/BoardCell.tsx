import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { IMPORTED_IMAGES_NAMES } from "@/assets/index";

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
import { useSelector } from "react-redux";
import { getTargetSelectedSelector } from "state/redux/selectors";

interface BoardCellProps {
  position: number;
}

const getSource = (target: string) => {
  switch (target) {
    case "bug":
      return IMPORTED_IMAGES_NAMES.bug;
    case "virus":
      return IMPORTED_IMAGES_NAMES.virus;
    case "insect":
      return IMPORTED_IMAGES_NAMES.insect;
    case "spider":
      return IMPORTED_IMAGES_NAMES.spider;
    default:
      return IMPORTED_IMAGES_NAMES.virus;
  }
};

const getBonusSource = (target: string) => {
  switch (target) {
    case "bug":
      return IMPORTED_IMAGES_NAMES.bonus;
    case "virus":
      return IMPORTED_IMAGES_NAMES.mask;
    default:
      return IMPORTED_IMAGES_NAMES.bonus;
  }
};

const BoardCell: React.FC<BoardCellProps> = ({ position }) => {
  const boardContext = useBoardContextState();
  const boarCellState = useCellState(position);
  const dispatcher = useBoardContextDispatcher();
  const window = useWindowDimensions();
  const selectedTarget = useSelector(getTargetSelectedSelector);

  const clickTarget = useClickTarget(position);
  const missBonus = useMissBonus(position);
  const clickBonus = useClickBonus(position);
  const missTarget = useMissTarget(position);

  // Height should always be greater than width
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

  const clickAction = () => {
    if (!boarCellState.show && !boarCellState.showBonus) {
      return missTarget();
    }
    if (boarCellState.show) return clickTarget();
    if (boarCellState.showBonus) return clickBonus();
  };

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
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={clickAction}
        >
          {!boarCellState.show && !boarCellState.showBonus && (
            <TouchableOpacity
              onPress={missTarget}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          {boarCellState.show && (
            <Image
              source={getSource(selectedTarget)}
              style={[
                styles.imageContainer,
                {
                  width: cellSize / 2,
                  height: cellSize / 2,
                },
              ]}
              //onPress={clickTarget}
            />
          )}
          {boarCellState.showBonus && (
            <Image
              source={getBonusSource(selectedTarget)}
              style={[
                styles.imageBonusContainer,
                {
                  width: cellSize / 2,
                  height: cellSize / 2,
                },
              ]}
              //onPress={clickBonus}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }, [
    cellSize,
    boarCellState.show,
    boarCellState.showBonus,
    clickTarget,
    clickBonus,
    missTarget,
    selectedTarget,
  ]);
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
