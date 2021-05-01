import React, { useEffect, useState } from "react";
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
} from "containers/boardContext";
import Colors from "constants/Colors";

//usecontext
const BoardCell = ({ position }) => {
  const boardContext = useBoardContextState();

  const dispatcher = useBoardContextDispatcher();
  const window = useWindowDimensions();
  const [show, setShow] = useState(false);

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

  const onClick = () => {
    //callback that send yes to parent from context
    if (!boardContext.finished && boardContext.started) {
      boardContext.playSound();
      setShow(false);
      dispatcher({ type: "INCREMENT", position });
    }
  };

  const onError = () => {
    dispatcher({ type: "DECREMENT", position });
  };
  const onIncrementTimeoutBonus = () => {
    dispatcher({ type: "INCREMENT_TIMEOUT", position });
  };
  useEffect(() => {
    if (boardContext.finished || boardContext.cleanBoard) {
      setShow(false);
    }
  }, [boardContext.finished, boardContext.cleanBoard]);

  useEffect(() => {
    if (boardContext.next === position && show === false) {
      setShow(true);
      //dispatcher({type: "NEWVirusCASE", position  })
    }
    if (boardContext.next === position && show === true) {
      dispatcher({ type: "RELOAD_NEXT", avoid: position });
    }
  }, [boardContext.next, position, dispatcher]);

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
      {!show && (
        <TouchableOpacity
          onPress={onError}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {show && (
        <Image
          source={virus}
          containerStyle={[
            styles.imageContainer,
            {
              width: cellSize / 2,
              height: cellSize / 2,
            },
          ]}
          onPress={onClick}
        />
      )}
    </View>
  );
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
});

export default BoardCell;
