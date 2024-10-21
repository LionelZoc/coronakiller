import { Platform, Share } from "react-native";
import * as Sentry from '@sentry/react-native';
import { getLevelStatus } from "components/GameLevel";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isInteger from "lodash/isInteger";

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

export const getParsedNumber = (value) => {
  if (!isNumber(value)) return 0;

  let finalValue = isInteger(value) ? value : value.toFixed(3);
  return finalValue;
};
//S=> 5, A=>4, B=>3, C=>2, D=>1
export const getRankValue = ({ score, totalPlayTime }) => {
  const targetPerSecond = score / totalPlayTime;
  if (targetPerSecond > 4.1) return 5;
  if (targetPerSecond >= 4) return 4;
  if (targetPerSecond >= 3) return 3;
  if (targetPerSecond >= 2) return 2;
  return 1;
};

export const NEXT_LEVEL_THRESHOLD = 4;
//S=> 5, A=>4, B=>3, C=>2, D=>1
export const getRank = ({ score, totalPlayTime }) => {
  const targetPerSecond = score / totalPlayTime;
  if (targetPerSecond > 4.1) return "S";
  if (targetPerSecond >= NEXT_LEVEL_THRESHOLD) return "A";
  if (targetPerSecond >= 3) return "B";
  if (targetPerSecond >= 2) return "C";
  return "D";
};

export const isScoreBetter = ({ newScore, oldScore }) => {
  if (newScore.level > oldScore.level) return true;
  const scoreRank = getRankValue({
    score: newScore.score,
    totalPlayTime: newScore.playTime,
  });
  const oldScoreRank = getRankValue({
    score: oldScore.score,
    totalPlayTime: oldScore.playTime,
  });

  return scoreRank > oldScoreRank;
};
