import React, { useCallback } from "react";
import { Button, Image } from "react-native-elements";
//import PropTypes from "prop-types";
import { StyleSheet, View, Text, ScrollView } from "react-native";
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

const GamePresentation = () => {
  const navigation = useNavigation();
  const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);
  const dispatch = useDispatch();
  const onSeePresentation = useCallback(() => {
    dispatch(seePresentation());
    navigation.dispatch(
      DrawerActions.jumpTo(ifUserSelectTarget ? "Board" : "Target Selection")
    );
  }, [dispatch, ifUserSelectTarget, navigation]);
  return (
    <Parent>
      <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
        <View style={styles.container}>
          <View></View>
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionRow}>
              <View style={styles.imageBlock}>
                <Image source={bug} containerStyle={[styles.imageContainer]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.description}>
                  Ecrasez le plus de cible possible dans le temps imparti.
                </Text>
              </View>
            </View>
            <View style={styles.descriptionRow}>
              <View style={styles.imageBlock}>
                <Image
                  source={bonus}
                  containerStyle={[styles.imageContainer]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.description}>
                  Tapez sur le spray pour débloquer un bonus qui offre 10
                  secondes de plus.
                </Text>
              </View>
            </View>

            <View style={styles.descriptionRow}>
              <View style={styles.imageBlock}>
                <View style={styles.emptyCase} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.description}>
                  Quand vous tapez une case vide , vous perdez 1 point.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.actionSection}>
            <Button
              title="Play"
              onPress={onSeePresentation}
              titleStyle={{ fontWeight: "bold", fontSize: 18 }}
              buttonStyle={{
                borderWidth: 0,
                borderColor: "transparent",
                borderRadius: 20,
              }}
              containerStyle={{
                width: 150,
                maxWidth: 200,
              }}
            ></Button>
          </View>
        </View>
      </ScrollView>
    </Parent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  descriptionSection: {
    flex: 3,
    justifyContent: "flex-end",
    width: "100%",
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

export default GamePresentation;
