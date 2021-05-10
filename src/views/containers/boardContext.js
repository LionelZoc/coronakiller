import React, {
  useReducer,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import random from "lodash/random";
import map from "lodash/map";
import filter from "lodash/filter";
import get from "lodash/get";
import set from "lodash/set";
import { getLevelSelector } from "state/redux/selectors";
import { useSelector } from "react-redux";
import toNumber from "lodash/toNumber";
import isEmpty from "lodash/isEmpty";

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
  cases: {},
});
const BoardDispatcherContext = React.createContext({
  dispatch: () => {},
});
const createBoard = (size) => {
  const cases = {};
  for (let i = 0; i < size; i++) {
    cases[`${i}`] = { index: i, show: false, showBonus: false };
  }
  return cases;
};
const cleanBoard = (board, size) => {
  const cases = board;
  for (let i = 0; i < size; i++) {
    cases[`${i}`] = {
      index: i,
      show: false,
      showBonus: cases[`${i}`].showBonus,
    };
  }
  return cases;
};
const boardContextReducer = (state, action) => {
  switch (action.type) {
    case "DECREMENT": {
      const cases = state.cases;
      const list = getBonusPosition(cases);

      for (let i = 0; i < list.length; i++) {
        set(cases, `${list[i]}.showBonus`, false);
      }

      return {
        ...state,
        score: state.score > 0 ? state.score - 1 : 0,
        lastMissed: action.position,
        bonus: -1,
        cases,
      };
    }
    case "INCREMENT": {
      if (!state.finished && state.started) {
        state.playSound("hit");
        const cases = state.cases;

        set(cases, `${action.position}.show`, false);

        return {
          ...state,
          score: state.score + 1,
          //visibleVirus: state.visibleVirus >= 1 ? state.visibleVirus - 1 : 0,
          cases,
          lastKilled: action.position,
        };
      }
      return state;
    }
    case "CHANGE_TARGET_POSITION": {
      return {
        ...state,
        score: state.score + 1,
        visibleVirus: state.visibleVirus >= 1 ? state.visibleVirus - 1 : 0,
        lastKilled: action.position,
      };
    }
    case "UPDATE_VIRUSES": {
      return {
        ...state,
        cases: action.cases,
        //visibleVirus: state.visibleVirus + 1,
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
      //avoid for now
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
      const cases = state.cases;

      let bonus;
      do {
        bonus = random(0, state.size - 1);
      } while (bonus === state.next || bonus === action.avoid);
      set(cases, `${bonus}.showBonus`, true);
      set(cases, `${bonus}.show`, false);
      return {
        ...state,
        //bonus,
        cases,
      };
    }

    case "CLEAR_BONUS": {
      //if (state.bonus === -1) return state;
      const cases = state.cases;
      const list = getBonusPosition(cases);

      for (let i = 0; i < list.length; i++) {
        set(cases, `${list[i]}.showBonus`, false);
      }
      //set(cases, `${state.bonus}.showBonus`, false);
      return {
        ...state,
        //bonus: -1,
        cases,
      };
    }

    case "BONUS": {
      const cases = state.cases;
      if (action.position > -1) {
        set(cases, `${action.position}.show`, false);
        set(cases, `${action.position}.showBonus`, true);
      }
      //// TODO: remove
      // if (state.bonus !== -1) {
      //   set(cases, `${state.bonus}.showBonus`, false);
      // }

      return {
        ...state,
        //bonus: action.position,
        cases,
      };
    }
    case "TIMEOUT": {
      const cases = createBoard(state.size);
      return {
        ...state,
        finished: true,
        started: false,
        cleanBoard: true,
        visibleVirus: 0,
        cases,
      };
    }
    case "STOP": {
      const cases = createBoard(state.size);
      return {
        ...state,
        finished: false,
        started: false,
        cleanBoard: true,
        visibleVirus: 0,
        cases,
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
        totalPlayTime: 60,
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
        totalPlayTime: 60,
        //bonus: -1,
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
      const cases = state.cases;
      const list = getBonusPosition(cases);

      for (let i = 0; i < list.length; i++) {
        set(cases, `${list[i]}.showBonus`, false);
      }
      //set(cases, `${state.bonus}.showBonus`, false);
      return {
        ...state,
        incrementTimeout: false,
        totalPlayTime: state.totalPlayTime + 10,
        //bonus: -1,
        cases,
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
        //bonus: action.bonus,
        totalPlayTime: 60,
        cases: action.cases,
      };
    }
  }
};
const getVirusPositions = (cases) => {
  const list = filter(cases, (cell) => cell.show);
  return map(list, (cell) => cell.index);
};
const getBonusPosition = (cases) => {
  const list = filter(cases, (cell) => cell.showBonus);
  return map(list, (cell) => cell.index);
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
  const level = useSelector(getLevelSelector);

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
    let cases = {};
    for (let i = 0; i < size; i++) {
      cases[`${i}`] = { index: i, show: false, showBonus: false };
    }
    dispatch({
      type: "INIT",
      size,
      visibleVirus: 0,
      finished: false,
      timeout,
      incrementTimeout: false,
      started: false,
      cleanBoard: false,
      //bonus: -1,
      cases,
    });
  }, [size]);

  //dispatch bonus

  useEffect(() => {
    const cases = boardContextState.cases;
    const bonusList = getBonusPosition(cases);

    if (
      //boardContextState.visibleVirus < 4 &&
      !boardContextState.finished &&
      !boardContextState.cleanBoard &&
      boardContextState.started &&
      isEmpty(bonusList) &&
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
    boardContextState.cases,
    boardContextState.finished,
    boardContextState.cleanBoard,
    boardContextState.started,
    boardContextState.size,
  ]);

  //dispatch target
  useEffect(() => {
    let positions = getVirusPositions(boardContextState.cases);

    let cases = boardContextState.cases;

    const toCreate = 4 - positions.length;

    if (
      toCreate > 0 &&
      !boardContextState.finished &&
      !boardContextState.cleanBoard &&
      !isEmpty(cases)
    ) {
      for (let i = 0; i < toCreate; i++) {
        let next;
        do {
          next = random(0, boardContextState.size - 1);
        } while (
          positions.includes(next) ||
          next === boardContextState.lastKilled
          //  next === boardContextState.bonus
        );
        positions.push(next);
        set(cases, `${next}.show`, true);
      }

      dispatch({ type: "UPDATE_VIRUSES", cases });
    }
  }, [
    boardContextState.size,
    boardContextState.cases,
    boardContextState.finished,
    boardContextState.cleanBoard,
    boardContextState.lastKilled,
  ]);

  const mixBoard = useCallback(() => {
    //let positions = getVirusPositions(boardContextState.cases);

    let cases = boardContextState.cases;
    let cleanCases = cleanBoard(cases, boardContextState.size);
    const bonusPosition = getBonusPosition(cleanCases);
    const toCreate = 4;
    if (
      toCreate > 0 &&
      !boardContextState.finished &&
      !boardContextState.cleanBoard
    ) {
      for (let i = 0; i < toCreate; i++) {
        let next;
        do {
          next = random(0, boardContextState.size - 1);
        } while (bonusPosition.includes(next));
        //positions.push(next);
        set(cleanCases, `${next}.show`, true);
      }

      dispatch({ type: "UPDATE_VIRUSES", cases: cleanCases });
    }
  }, [
    boardContextState.size,
    boardContextState.cases,
    boardContextState.finished,
    boardContextState.cleanBoard,
  ]);
  //level 2 system
  useEffect(() => {
    if (toNumber(level) > 1 && boardContextState.started) {
      const interval = setInterval(() => {
        //if (show) {
        //setShow(false);
        //dispatcher({ type: "RELOAD_NEXT", avoid: position });
        mixBoard();
        //  }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [level, mixBoard, boardContextState.started]);

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
const useClickTarget = (position) => {
  const dispatch = useContext(BoardDispatcherContext);
  const clickTarget = useCallback(() => {
    dispatch({ type: "INCREMENT", position });
  }, [dispatch, position]);
  if (dispatch === undefined) {
    throw new Error(" dispatch must be used within a BoardDispatcherContext");
  }
  return clickTarget;
};
const useMissTarget = (position) => {
  const dispatch = useContext(BoardDispatcherContext);
  const clickTarget = useCallback(() => {
    dispatch({ type: "DECREMENT", position });
    //clear bonus
  }, [dispatch, position]);
  if (dispatch === undefined) {
    throw new Error(" dispatch must be used within a BoardDispatcherContext");
  }
  return clickTarget;
};

const useClickBonus = (position) => {
  const dispatch = useContext(BoardDispatcherContext);
  const clickTarget = useCallback(() => {
    dispatch({ type: "INCREMENT_TIMEOUT", position });
    //clear bonus
  }, [dispatch, position]);
  if (dispatch === undefined) {
    throw new Error(" dispatch must be used within a BoardDispatcherContext");
  }
  return clickTarget;
};

const useMissBonus = (position) => {
  const dispatch = useContext(BoardDispatcherContext);
  const clickTarget = useCallback(() => {
    dispatch({ type: "CLEAR_BONUS", position });
    //check if bonus was at this position
    //clear bonus
  }, [dispatch, position]);
  if (dispatch === undefined) {
    throw new Error(" dispatch must be used within a BoardDispatcherContext");
  }
  return clickTarget;
};

const useCellState = (index) => {
  const boardContext = useBoardContextState();
  return get(boardContext, `cases.${index}`, {});
};
export {
  useBoardContextState,
  BoardContextProvider,
  useBoardContextDispatcher,
  useCellState,
  useClickTarget,
  useMissBonus,
  useClickBonus,
  useMissTarget,
};
