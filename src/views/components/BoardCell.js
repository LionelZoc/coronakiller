import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import { getLevelSelector } from "state/redux/selectors";
import { useSelector } from "react-redux";
import toNumber from "lodash/toNumber";

//usecontext
const BoardCell = ({ position }) => {
  const boardContext = useBoardContextState();
  const level = useSelector(getLevelSelector);
  const dispatcher = useBoardContextDispatcher();
  const window = useWindowDimensions();
  const [show, setShow] = useState(false);
  const [showBonus, setShowBonus] = useState(false);

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

  const onClick = useCallback(() => {
    const callback = () => {
      //callback that send yes to parent from context
      if (!boardContext.finished && boardContext.started) {
        boardContext.playSound("hit");
        setShow(false);
        dispatcher({ type: "INCREMENT", position });
      }
    };
    callback();
  }, [boardContext.finished, boardContext.started, position, dispatcher]);

  const onError = useCallback(() => {
    const callback = () => {
      //boardContext.playSound("fail");
      dispatcher({ type: "DECREMENT", position });
      dispatcher({ type: "CLEAR_BONUS", position });
    };
    callback();
  }, [position, dispatcher]);
  const onClickBonus = useCallback(() => {
    const callback = () => {
      //boardContext.playBonusSound();
      setShowBonus(false);
      dispatcher({ type: "INCREMENT_TIMEOUT", position });
    };
    callback();
  }, [dispatcher, position]);

  useEffect(() => {
    if (boardContext.finished || boardContext.cleanBoard) {
      setShow(false);
      setShowBonus(false);
    }
  }, [boardContext.finished, boardContext.cleanBoard]);
  //
  useEffect(() => {
    if (toNumber(level) > 1 && show && boardContext.started) {
      const timeout = setTimeout(() => {
        if (show) {
          setShow(false);
          dispatcher({ type: "RELOAD_NEXT", avoid: position });
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [level, show, position, dispatcher, boardContext.started]);
  //
  useEffect(() => {
    //if (!showBonus) return () => false;
    const timeout = setTimeout(() => {
      if (showBonus) {
        setShowBonus(false);
        dispatcher({ type: "CLEAR_BONUS", position });
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [showBonus, dispatcher, position]);
  useEffect(() => {
    if (boardContext.next === position && show === false) {
      setShow(true);
      //dispatcher({type: "NEWVirusCASE", position  })
    }
    if (boardContext.next === position && show === true) {
      dispatcher({ type: "RELOAD_NEXT", avoid: position });
    }
  }, [boardContext.next, position, dispatcher]);
  useEffect(() => {
    if (boardContext.bonus === position && show === false) {
      setShowBonus(true);
      //dispatcher({type: "NEWVirusCASE", position  })
    }
    if (boardContext.bonus === position && show === true) {
      dispatcher({ type: "RELOAD_BONUS", avoid: position });
    }
    if (boardContext.bonus === -1 && showBonus === true) {
      setShowBonus(false);
    }
  }, [boardContext.bonus, showBonus, position, show, dispatcher]);

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
        {!show && !showBonus && (
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
        {showBonus && (
          <Image
            source={mask}
            containerStyle={[
              styles.imageBonusContainer,
              {
                width: cellSize / 2,
                height: cellSize / 2,
              },
            ]}
            onPress={onClickBonus}
          />
        )}
      </View>
    );
  }, [cellSize, show, showBonus, onClick, onClickBonus, onError, position]);
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
