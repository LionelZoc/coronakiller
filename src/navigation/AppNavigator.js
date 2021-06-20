import React from "react";
import { NavigationContainer } from "@react-navigation/native";
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
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const AppContainer = () => {
  // const seePresentation = useSelector(getSeePresentationSelector);
  // const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);
  // // {!seePresentation && <GamePresentation />}
  // // {seePresentation && !ifUserSelectTarget && (
  // //   <BoardTargetSelection />
  // // )}
  // // {seePresentation && ifUserSelectTarget && <Board />}
  // const initialRouteName = !seePresentation
  //   ? "GamePresentation"
  //   : seePresentation && !ifUserSelectTarget
  //   ? "TargetSelection"
  //   : "Board";
  // console.log("initialRouteName is", initialRouteName);
  //<Stack.Navigator headerMode="none" initialRouteName="Board">
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Board" component={Board} />
      <Drawer.Screen name="GamePresentation" component={GamePresentation} />
      <Drawer.Screen name="TargetSelection" component={BoardTargetSelection} />
    </Drawer.Navigator>
  );
};
export default AppContainer;

// import * as React from "react";
// import { Button, View } from "react-native";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { NavigationContainer } from "@react-navigation/native";
//
// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Button
//         onPress={() => navigation.navigate("Notifications")}
//         title="Go to notifications"
//       />
//     </View>
//   );
// }
//
// function NotificationsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Button onPress={() => navigation.goBack()} title="Go back home" />
//     </View>
//   );
// }
//
// const Drawer = createDrawerNavigator();
//
// export default function App() {
//   return (
//     <Drawer.Navigator initialRouteName="Home">
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="Notifications" component={NotificationsScreen} />
//     </Drawer.Navigator>
//   );
// }
