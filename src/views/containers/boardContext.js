import React, { useReducer, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import random from "lodash/random";

const BoardContext = React.createContext({
  score: 0,
  level: 0,
  pseudo: "",
  size: 16,
  visibleVirus: 0,
  lastKilled: undefined,
  next: undefined,
  finished: false,
});
const BoardDispatcherContext = React.createContext({
  dispatch: () => {},
});

const boardContextReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT": {
      return {
        ...state,
        score: state.score + 1,
        visibleVirus: state.visibleVirus >= 1 ? state.visibleVirus - 1 : 0,
        lastKilled: action.position,
      };
    }
    case "NEXT": {
      return {
        ...state,
        next: action.position,
        visibleVirus: state.visibleVirus + 1,
      };
    }
    case "RELOAD_NEXT": {
      let next;
      do {
        next = random(0, state.size - 1);
      } while (next === state.lastKilled || next === action.avoid);

      return {
        ...state,
        next,
      };
    }
    case "TIMEOUT": {
      return {
        ...state,
        finished: true,
      };
    }
    case "RESTART": {
      return {
        ...state,
        score: 0,
        visibleVirus: 0,
        finished: false,
        lastKilled: undefined,
      };
    }
    case "UPDATE_SOUND": {
      return {
        ...state,
        playSound: action.playSound,
      };
    }
    case "UPDATE_TIMEOUT": {
      return {
        ...state,
        timeout: action.timeout,
      };
    }
    case "INIT": {
      return {
        ...state,
        size: action.size,
        score: 0,
        visibleVirus: action.visibleVirus,
        finished: action.finished,
        playSound: action.playSound,
      };
    }
  }
};

const BoardContextProvider = ({ size, playSound, children, timeout }) => {
  const [boardContextState, dispatch] = useReducer(boardContextReducer, {
    size,
    playSound: playSound,
    timeout,
  });
  //update sound effect
  useEffect(() => {
    dispatch({
      type: "UPDATE_SOUND",
      playSound,
    });
  }, [playSound]);
  useEffect(() => {
    dispatch({
      type: "UPDATE_TIMEOUT",
      timeout,
    });
  }, [timeout]);
  useEffect(() => {
    dispatch({
      type: "INIT",
      size,
      visibleVirus: 0,
      finished: false,
      timeout,
    });
  }, [size]);

  //// TODO: create a dispatch virus function
  useEffect(() => {
    if (boardContextState.visibleVirus < 4 && !boardContextState.finished) {
      //find next virus place
      let next;
      do {
        next = random(0, boardContextState.size - 1);
      } while (
        next === boardContextState.lastKilled ||
        next === boardContextState.next
      );
      dispatch({ type: "NEXT", position: next });
    }
  }, [
    boardContextState.visibleVirus,
    boardContextState.lastKilled,
    boardContextState.finished,
    boardContextState.next,
  ]);

  return (
    <BoardDispatcherContext.Provider value={dispatch}>
      <BoardContext.Provider value={boardContextState}>
        {children}
      </BoardContext.Provider>
    </BoardDispatcherContext.Provider>
  );
};

BoardContextProvider.propTypes = {
  size: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  playSound: PropTypes.func,
  timeout: PropTypes.number,
};
BoardContextProvider.defaultProps = {
  size: 16,
  timeout: 60,
};
const useBoardContextState = () => {
  const boardContext = useContext(BoardContext);
  if (boardContext === undefined) {
    throw new Error(
      " useBoardContextState must be used within a BoardContextProvider"
    );
  }
  return boardContext;
};
const useBoardContextDispatcher = () => {
  const boardContextDispatcher = useContext(BoardDispatcherContext);
  if (boardContextDispatcher === undefined) {
    throw new Error(
      " boardContextDispatcher must be used within a BoardDispatcherContext"
    );
  }
  return boardContextDispatcher;
};

export {
  useBoardContextState,
  BoardContextProvider,
  useBoardContextDispatcher,
};
