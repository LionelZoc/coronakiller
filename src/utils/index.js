import { Platform, Share } from "react-native";
import * as Sentry from "sentry-expo";
import { getLevelStatus } from "components/GameLevel";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
export const onShare = async (score, level) => {
  try {
    let link;
    if (Platform.OS === "android") {
      link =
        "https://play.google.com/store/apps/details?id=com.lazone.covid_killer";
    } else {
      link = "https://apps.apple.com/us/app/vira-ert/id1565445370";
    }
    const result = await Share.share(
      {
        message: `psss, i've just made a score of ${score} at level ${getLevelStatus(
          level
        )}  on this game can you do more than that ?. ${link}`,
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

export const getInitials = (string) => {
  if (isEmpty(string) || !isString(string)) return "";

  let names = string.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};
