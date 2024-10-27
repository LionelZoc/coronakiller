//icon type export declare type IconType = 'material' | 'material-community' | 'simple-line-icon' | 'zocial' | 'font-awesome' | 'octicon' | 'ionicon' | 'foundation' | 'evilicon' | 'entypo' | 'antdesign' | 'font-awesome-5' | string;

const ROUTES = {
  BOARD: {
    name: "Board",
    relativePath: "board",
    path: "(drawer)/board",
    drawerIcon: "checkerboard",
    iconType: "material-community",
  },
  GAME_PRESENTATION: {
    name: "Game Presentation",
    relativePath: "game-presentation",
    path: "(drawer)/game-presentation",
    drawerIcon: "book-open",
    iconType: "simple-line-icon",
  },
  TARGET_SELECTION: {
    name: "Target Selection",
    path: "(drawer)/target-selection",
    relativePath: "target-selection",
    drawerIcon: "target",
    iconType: "material-community",
  },
  LEADERBOARD: {
    name: "LeaderBoard",
    relativePath: "leaderboard",
    path: "(drawer)/leaderboard",
    drawerIcon: "leaderboard",
    iconType: "material",
  },
};

export default ROUTES;
