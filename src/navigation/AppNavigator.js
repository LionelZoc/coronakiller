import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import {
  getSeePresentationSelector,
  getIfUserSelectedTargetSelector,
} from "state/redux/selectors";
import Board from "components/Board";
import GamePresentation from "components/GamePresentation";
import BoardTargetSelection from "components/BoardTargetSelection";
import GameLeaderBoard from "containers/GameLeaderBoard";
const Drawer = createDrawerNavigator();
const AppContainer = () => {
  const seePresentation = useSelector(getSeePresentationSelector);
  const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);
  // // {!seePresentation && <GamePresentation />}
  // // {seePresentation && !ifUserSelectTarget && (
  // //   <BoardTargetSelection />
  // // )}
  // {seePresentation && ifUserSelectTarget && <Board />}
  const initialRouteName = !seePresentation
    ? "GamePresentation"
    : seePresentation && !ifUserSelectTarget
    ? "TargetSelection"
    : "Board";
  return (
    <Drawer.Navigator initialRouteName={initialRouteName}>
      <Drawer.Screen name="Board" component={Board} />
      <Drawer.Screen name="Game Presentation" component={GamePresentation} />
      <Drawer.Screen name="Target Selection" component={BoardTargetSelection} />
      <Drawer.Screen name="LeaderBoard (Beta)" component={GameLeaderBoard} />
    </Drawer.Navigator>
  );
};
export default AppContainer;
