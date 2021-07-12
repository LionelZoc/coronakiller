import React from "react";
import { Button, Image, Avatar, Badge, ListItem } from "react-native-elements";
//import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from "react-native";
//import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { getInitials, getParsedNumber, getRank, getRankValue } from "utils";
import Colors from "constants/Colors";
import {
  getHighScoreSelector,
  getHighestLevelSelector,
  getHighestScorePlaytimeSelector,
} from "state/redux/selectors";

const UserProfile = () => {
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firestore.profile);
  const highScore = useSelector(getHighScoreSelector);
  const level = useSelector(getHighestLevelSelector);
  const highScorePlaytime = useSelector(getHighestScorePlaytimeSelector);

  const userCloudScore = useSelector(
    (state) => state.firestore.data.user_score
  );
  const connectedHighScore =
    userCloudScore &&
    userCloudScore.level === level &&
    userCloudScore.value > highScore
      ? userCloudScore.value
      : highScore;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Avatar
          rounded
          size="large"
          title={getInitials(profile?.username || "undefined")}
          titleStyle={{ color: "black" }}
          containerStyle={{ backgroundColor: Colors.grey }}
        />
      </View>
      <View style={styles.description}>
        <Text style={styles.username}>{profile?.username || "Anonymous"}</Text>
        <Text style={styles.scoreLabel}>
          Highest Level: <Text style={styles.scoreValue}>{level}</Text>
        </Text>
        <Text style={styles.scoreLabel}>
          Best Score: <Text style={styles.scoreValue}>{highScore}</Text>
        </Text>
        <Text style={styles.scoreLabel}>
          Play time :{" "}
          <Text style={styles.scoreValue}>{`${highScorePlaytime} s`}</Text>
        </Text>
        <Text style={styles.scoreLabel}>
          KPS:{" "}
          <Text style={styles.kpsValue}>
            {`${getParsedNumber(highScore / highScorePlaytime)} /s`}
          </Text>
        </Text>
        <Text style={styles.scoreLabel}>
          Rank:{" "}
          <Text style={styles.scoreValue}>
            {getRank({ score: highScore, totalPlayTime: highScorePlaytime })}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
    borderStyle: "solid",
    borderColor: "red",
    width: "100%",
  },
  description: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 2,
  },
  avatar: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: "100%",
  },
  scoreValue: {
    marginLeft: 10,
    color: Colors.black,
    fontWeight: "bold",
  },
  username: {
    color: Colors.black,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreLabel: {
    color: Colors.grey,
    letterSpacing: 0.5,
    fontSize: 18,
  },
  kpsValue: {
    color: Colors.darkBlue,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
});

export default UserProfile;
