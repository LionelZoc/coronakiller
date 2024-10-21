import { useCallback } from "react";
import { Button } from "react-native-elements";
import { Image } from "expo-image";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { seePresentation } from "state/redux/actions";
import { getIfUserSelectedTargetSelector } from "state/redux/selectors";
import Colors from "constants/Colors";

import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { IMPORTED_IMAGES_NAMES } from "@/assets/index";
import ROUTES from "constants/routes";

const GamePresentation = () => {
  const navigation = useNavigation();
  const ifUserSelectTarget = useSelector(getIfUserSelectedTargetSelector);
  const dispatch = useDispatch();
  const onSeePresentation = useCallback(() => {
    dispatch(seePresentation());
    navigation.dispatch(
      DrawerActions.jumpTo(
        ifUserSelectTarget
          ? ROUTES.BOARD.relativePath
          : ROUTES.TARGET_SELECTION.relativePath,
      ),
    );
  }, [dispatch, ifUserSelectTarget, navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
        <View style={styles.container}>
          <View></View>
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionRow}>
              <View style={styles.imageBlock}>
                <Image
                  source={IMPORTED_IMAGES_NAMES.targetBug}
                  style={styles.imageContainer}
                />
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
                  source={IMPORTED_IMAGES_NAMES.insecticide}
                  style={[styles.imageContainer]}
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
    </SafeAreaView>
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
