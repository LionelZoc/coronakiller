import { Redirect } from "expo-router";

import ROUTES from "constants/routes";
import { useSelector } from "react-redux";
import {
  getSeePresentationSelector,
  getIfUserSelectedTargetSelector,
} from "state/redux/selectors";
import { View, Text } from "react-native";
import ActivityIndicator from "components/ActivityIndicator";

export default function Index() {
  //add some loading UI here
  // Redirect to the Board (or any initial screen based on your logic)
  const seePresentation = useSelector(getSeePresentationSelector);
  const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);

  if (!seePresentation) {
    return <Redirect href={ROUTES.GAME_PRESENTATION.path} />;
  }

  if (seePresentation && !ifUserSelectTarget) {
    return <Redirect href={ROUTES.TARGET_SELECTION.path} />;
  }

  return <Redirect href={ROUTES.BOARD.path} />;
}
