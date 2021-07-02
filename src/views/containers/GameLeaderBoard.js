import React, { useCallback } from "react";
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
import { seePresentation } from "state/redux/actions";
import { getIfUserSelectedTargetSelector } from "state/redux/selectors";
import bug from "assets/targetBug.png";
import bonus from "assets/insecticide.png";
import Colors from "constants/Colors";
import Parent from "components/ParentView";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { getInitials, getParsedNumber } from "utils";

import { useFirestoreConnect, populate } from "react-redux-firebase";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import forIn from "lodash/forIn";
import set from "lodash/set";
import Auth from "./Auth";

//import PropTypes from "prop-types";
// useFirestoreConnect(() => [
//    { collection: 'todos', doc: todoId } // or `todos/${props.todoId}`
//  ])
//  const todo = useSelector(
//    ({ firestore: { data } }) => data.todos && data.todos[todoId]
//  )

// {
//   collection: "user_demands",
//   where: [["author", "==", `${author}`]],
//   orderBy: [["created_at", "desc"]],
//   limit: 10,
//   populates,
//   type: "once"
// }
const populates = [{ child: "owner", root: "users" }];
const renderItem = ({ item, index }) => {
  if (
    //_.isEmpty(auth) ||
    isEmpty(item)
    // !_.has(item, "members") ||
    // !_.has(item, "id")
  ) {
    return null;
  }
  // <TouchableHighlight
  //   underlayColor="white"
  //   key={`${item.id}`}
  //   onPress={() => {}}
  //   testID="chatElement"
  // >
  console.log("initials", getInitials(item.username || "undefined"));
  return (
    <ListItem
      onPress={() => {}}
      key={`${item.id}`}
      bottomDivider
      containerStyle={{}}
    >
      <ListItem.Content>
        <View style={styles.row}>
          <View style={styles.rankNumber}>
            <Text style={styles.rank}>{`${index + 1} .`}</Text>
          </View>
          <View style={styles.rankContent}>
            <View style={styles.userAvatar}>
              <Avatar
                rounded
                size="small"
                title={getInitials(item.username || "undefined")}
                titleStyle={{ color: "black" }}
                containerStyle={{ backgroundColor: Colors.grey }}
              />
              <View style={styles.user}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.scoreLabel}>
                  Level: <Text style={styles.scoreValue}>{item.level}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.playScore}>
              <Text style={styles.scoreLabelSection}>
                Score :{" "}
                <Text style={[styles.scoreValue, styles.userStatScore]}>
                  {item.value}
                </Text>
              </Text>
              <Text style={styles.scoreLabel}>
                KPS :{" "}
                <Text style={styles.kpsValue}>
                  {`${getParsedNumber(item.value / item.playTime)} /s`}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};
const _keyExtractor = (item) => {
  return item && item.id;
};
const GameLeaderBoard = () => {
  // const navigation = useNavigation();
  // const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);
  // const dispatch = useDispatch();
  // const onSeePresentation = useCallback(() => {
  //   dispatch(seePresentation());
  //   navigation.dispatch(
  //     DrawerActions.jumpTo(ifUserSelectTarget ? "Board" : "TargetSelection")
  //   );
  // }, [dispatch, ifUserSelectTarget, navigation]);

  useFirestoreConnect(() => [
    {
      collection: "scores",
      orderBy: [
        ["level", "desc"],
        ["rank", "desc"],
        ["value", "desc"],
      ],
      limit: 100,
      populates,
      //type: "once",
    }, // or `todos/${props.todoId}`
  ]);
  //const scores = useSelector(({ firestore: { ordered } }) => ordered.scores);
  let scores = useSelector(({ firestore }) =>
    populate(firestore, "scores", populates)
  );
  forIn(scores, (item, key, bigChunk) => {
    set(bigChunk, `${key}.id`, key);
  });
  scores = map(scores, (score) => score);

  console.log("scores", isEmpty(scores), scores);
  return (
    <Parent>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text>my rank and connection</Text>
            <Auth />
          </View>
        </View>
        <View style={styles.list}>
          <FlatList
            ListEmptyComponent={
              <Text testID="emptyMessageList">empty board</Text>
            }
            data={scores}
            renderItem={renderItem}
            keyExtractor={_keyExtractor}
            onEndReachedThreshold={0.9}
            initialNumToRender={6}
            testID="leaderboardList"
          />
        </View>
      </View>
    </Parent>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    // borderColor: "black",
    // borderStyle: "solid",
    // borderWidth: 1,
    width: "100%",
    //paddingVertical: 5,
    //  marginBottom: 10,
  },
  rankNumber: {
    paddingRight: 10,
    paddingLeft: 20,
  },
  rank: {
    fontSize: 18,
  },
  rankContent: {
    flex: 1,
    flexDirection: "row",
    // borderColor: "blue",
    // borderStyle: "solid",
    // borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userAvatar: {
    //borderColor: "yellow",
    flexDirection: "row",
    // borderStyle: "solid",
    // borderWidth: 1,
  },
  user: {
    // borderColor: "purple",
    // borderStyle: "solid",
    // borderWidth: 1,
    marginLeft: 10,
  },
  playScore: {
    // borderColor: "red",
    // borderStyle: "solid",
    // borderWidth: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    minWidth: 120,
  },
  username: {
    color: Colors.black,
    fontWeight: "bold",
  },
  scoreLabel: {
    color: Colors.grey,
    letterSpacing: 0.5,
  },
  scoreLabelSection: {
    color: Colors.black,
    fontWeight: "bold",
    marginBottom: 2,
  },
  userStatScore: {
    color: Colors.tintColor,
    letterSpacing: 0.5,
    fontWeight: "bold",
    fontSize: 16,
  },
  scoreValue: {
    marginLeft: 10,
    color: Colors.black,
    fontWeight: "bold",
  },
  kpsValue: {
    color: Colors.darkBlue,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    //alignItems: "center",
    //padding: 10,
  },
  list: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: "100%",
  },
  headerContent: {},
  header: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
  description: {
    fontWeight: "bold",
    //textTransform: "uppercase",
    textAlign: "left",
    textAlignVertical: "center",
    letterSpacing: 0.5,
    fontSize: 18,
    color: "black",
  },
  descriptionRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
  },
  imageBlock: {
    width: 100,
    height: 100,
    display: "flex",
  },
  emptyCase: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: Colors.cellBorder,
    display: "flex",
    padding: 1,
  },
  imageContainer: {
    width: 90,
    height: 90,
  },
  actionSection: {
    flex: 1,
    justifyContent: "center",
  },
});

export default GameLeaderBoard;
