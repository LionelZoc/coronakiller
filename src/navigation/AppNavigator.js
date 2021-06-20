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
      <Drawer.Screen name="GamePresentation" component={GamePresentation} />
      <Drawer.Screen name="TargetSelection" component={BoardTargetSelection} />
    </Drawer.Navigator>
  );
};
export default AppContainer;
