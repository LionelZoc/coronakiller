import React, { useCallback } from "react";
import {
  Button,
  Image,
  Avatar,
  Badge,
  ListItem,
  Icon,
} from "react-native-elements";
import * as Facebook from "expo-facebook";
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
import { useFirebase } from "react-redux-firebase";
import * as Sentry from "sentry-expo";

const Auth = () => {
  // loginWithFb() {
  //   this.props.firebase.login({ provider: "facebook", type: "popup" });
  // }
  const firebase = useFirebase();
  const loginWithFacebook = async () => {
    await Facebook.initializeAsync({
      appId: "1256149281508808",
    });
    const data = await Facebook.logInWithReadPermissionsAsync(
      "fb1256149281508808",
      { permissions: ["public_profile", "email"] }
    );

    if (data.type === "success") {
      try {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.token
        );
        await firebase.login({ credential });
      } catch (e) {
        console.log("error", e);
        Sentry.Native.captureException(e);
      }
    }
  };
  return (
    <View style={styles.facebook}>
      <Button
        title="Login"
        type="outline"
        raised
        fullWidth={false}
        buttonStyle={{
          backgroundColor: "#4267B2",
        }}
        containerStyle={{
          width: 150,
          maxWidth: 200,
        }}
        titleStyle={{
          color: "white",
          marginLeft: 4,
        }}
        icon={
          <Icon name="facebook" size={30} color="white" type="fontAwesome" />
        }
        onPress={loginWithFacebook}
      />
    </View>
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
    //  width: "100%",
    //paddingVertical: 5,
  },
});

export default Auth;
