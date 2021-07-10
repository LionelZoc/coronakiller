import React, { useCallback, useEffect, useState } from "react";
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
import { useFirebase, isLoaded, isEmpty } from "react-redux-firebase";
import * as Sentry from "sentry-expo";
import get from "lodash/get";
import { createProfile } from "state/redux/actions";
const Auth = () => {
  // loginWithFb() {
  //   this.props.firebase.login({ provider: "facebook", type: "popup" });
  // }
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  //const [connected, setConnected] = useState(null);
  useEffect(() => {
    const toggleAuthAsync = async () => {
      await Facebook.initializeAsync({
        appId: "1256149281508808",
      });
      const auth = await Facebook.getAuthenticationCredentialAsync();

      if (!auth) {
        // Log in
        console.log("not connected");
        //setConnected(false)
      } else {
        // Log out
        console.log("user connected", auth);
        const response = await fetch(
          `https://graph.facebook.com/${auth.userId}?access_token=${auth.token}&fields=id,name,picture.type(large)`
        );
        const responseJson = await response.json();
        //setConnected(true)
        console.log("response json", responseJson);
      }
    };
    toggleAuthAsync();
  }, []);
  const loginWithFacebook = async () => {
    try {
      await Facebook.initializeAsync({
        appId: "1256149281508808",
      });
      const data = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      console.log("data from facebook", data);
      Sentry.Native.captureMessage(`connect to appId_${data.appId}`);
      if (data.type === "success") {
        try {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            data.token
          );
          console.log("ill log firebase after get credential");
          // Sign in with credential from the Facebook user.
          const userCredentials = await firebase
            .auth()
            .signInWithCredential(credential);
          console.log("credentials", userCredentials);
          dispatch(
            createProfile({
              firebaseUserId: userCredentials.user.uid,
              force: false,
            })
          );
          //userCredentials.user.uid
          //await firebase.login({ credential });
        } catch (e) {
          console.log("error", e);
          Sentry.Native.captureException(e);
        }
      } else {
        Sentry.Native.captureMessage("Facebook data failed");
      }
    } catch (e) {
      //console.log("error", e);
      Sentry.Native.captureException(e);
    }
  };
  return (
    <View style={styles.facebook}>
      {isLoaded(auth) && !isEmpty(auth) ? (
        <Text>{get(profile.name)}</Text>
      ) : (
        <Button
          title="Login with facebook"
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
      )}
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
