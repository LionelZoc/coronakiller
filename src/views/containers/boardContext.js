import React, { useReducer, useContext, useEffect, useRef } from "react";
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
  bonus: -1,
});
const BoardDispatcherContext = React.createContext({
  dispatch: () => {},
});

const boardContextReducer = (state, action) => {
  switch (action.type) {
    case "DECREMENT": {
      return {
        ...state,
        score: state.score > 0 ? state.score - 1 : 0,
        lastMissed: action.position,
        bonus: -1,
      };
    }
    case "INCREMENT": {
      return {
        ...state,
        score: state.score + 1,
        visibleVirus: state.visibleVirus >= 1 ? state.visibleVirus - 1 : 0,
        lastKilled: action.position,
      };
    }
    case "CHANGE_TARGET_POSITION": {
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
    case "RELOAD_BONUS": {
      let bonus;
      do {
        bonus = random(0, state.size - 1);
      } while (bonus === state.next || bonus === action.avoid);

      return {
        ...state,
        bonus,
      };
    }
    case "CLEAR_BONUS": {
      if (state.bonus === -1) return state;
      return {
        ...state,
        bonus: -1,
      };
    }
    case "BONUS": {
      return {
        ...state,
        bonus: action.position,
      };
    }
    case "TIMEOUT": {
      return {
        ...state,
        finished: true,
        started: false,
        cleanBoard: true,
        visibleVirus: 0,
      };
    }
    case "STOP": {
      return {
        ...state,
        finished: false,
        started: false,
        cleanBoard: true,
        visibleVirus: 0,
      };
    }
    case "START": {
      return {
        ...state,
        score: 0,
        finished: false,
        lastKilled: undefined,
        started: true,
        incrementTimeout: false,
        cleanBoard: false,
      };
    }
    case "RESTART": {
      return {
        ...state,
        score: 0,
        visibleVirus: 0,
        finished: false,
        lastKilled: undefined,
        started: true,
        incrementTimeout: false,
        cleanBoard: false,
        bonus: -1,
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
    case "INCREMENT_TIMEOUT": {
      return {
        ...state,
        incrementTimeout: true,
      };
    }
    case "TIMEOUT_INCREMENTED": {
      return {
        ...state,
        incrementTimeout: false,
        bonus: -1,
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
        started: action.started,
        incrementTimeout: false,
        cleanBoard: action.cleanBoard,
        bonus: action.bonus,
      };
    }
  }
};

const BoardContextProvider = ({ size, playSound, children, timeout }) => {
  const handlingBonus = useRef(false);
  const [boardContextState, dispatch] = useReducer(boardContextReducer, {
    size,
    playSound: playSound,
    timeout,
    incrementTimeout: false,
    cleanBoard: false,
  });

  useEffect(() => {
    if (!boardContextState.started && handlingBonus.current === true) {
      handlingBonus.current = false;
    }
  }, [boardContextState.started]);
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
      incrementTimeout: false,
      started: false,
      cleanBoard: false,
      bonus: -1,
    });
  }, [size]);

  //dispatch bonus

  useEffect(() => {
    if (
      //boardContextState.visibleVirus < 4 &&
      !boardContextState.finished &&
      !boardContextState.cleanBoard &&
      boardContextState.started &&
      boardContextState.bonus === -1 &&
      handlingBonus.current === false
    ) {
      handlingBonus.current = true;
      //find next virus place
      const interval = random(5, 30);

      const timeout = setTimeout(() => {
        let next;

        next = random(0, boardContextState.size - 1);
        dispatch({ type: "BONUS", position: next });
        handlingBonus.current = false;
      }, interval * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [
    //  boardContextState.visibleVirus,
    boardContextState.bonus,
    boardContextState.finished,
    boardContextState.cleanBoard,
    boardContextState.started,
    boardContextState.size,
  ]);

  //// TODO: create a dispatch virus function
  useEffect(() => {
    if (
      boardContextState.visibleVirus < 4 &&
      !boardContextState.finished &&
      !boardContextState.cleanBoard
    ) {
      //find next virus place
      let next;
      do {
        next = random(0, boardContextState.size - 1);
      } while (
        next === boardContextState.lastKilled ||
        next === boardContextState.next ||
        next === boardContextState.bonus
      );
      dispatch({ type: "NEXT", position: next });
    }
  }, [
    boardContextState.visibleVirus,
    boardContextState.lastKilled,
    boardContextState.finished,
    boardContextState.next,
    boardContextState.cleanBoard,
    boardContextState.bonus,
    boardContextState.size,
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
  playSound: () => {},
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
