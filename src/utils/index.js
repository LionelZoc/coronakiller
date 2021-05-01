import { Platform, Share } from "react-native";
import * as Sentry from "sentry-expo";
export const onShare = async (score) => {
  try {
    let link;
    if (Platform.OS === "android") {
      link =
        "https://play.google.com/store/apps/details?id=com.lazone.covid_killer";
    } else {
      link = "";
    }
    const result = await Share.share(
      {
        message: `psss, i've just made a score of ${score} on this game can you do more than that ?. ${link}`,
        title: "Share Vira!ert",
      },
      { dialogTitle: "Share Vira!ert " }
    );

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Sentry.captureException(error);
  }
};
