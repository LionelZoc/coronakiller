import React, { useEffect } from "react";
import { Button, Icon } from "react-native-elements";
//import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
//import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, isLoaded, isEmpty } from "react-redux-firebase";
import * as Sentry from "@sentry/react-native";
import get from "lodash/get";
import { createProfile } from "state/redux/actions";
import UserProfile from "components/UserProfile";
import {
  AccessToken,
  AuthenticationToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  Settings,
  ShareDialog,
} from "react-native-fbsdk-next";

const Auth = () => {
  // loginWithFb() {
  //   this.props.firebase.login({ provider: "facebook", type: "popup" });
  // }
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  //const [connected, setConnected] = useState(null);
  // useEffect(() => {
  //   const toggleAuthAsync = async () => {
  //     await Facebook.initializeAsync({
  //       appId: "1256149281508808",
  //     });
  //     const auth = await Facebook.getAuthenticationCredentialAsync();

  //     if (!auth) {
  //       // Log in
  //       console.log("not connected");
  //       //setConnected(false)
  //     } else {
  //       // Log out
  //       console.log("user connected", auth);
  //       const response = await fetch(
  //         `https://graph.facebook.com/${auth.userId}?access_token=${auth.token}&fields=id,name,picture.type(large)`
  //       );
  //       const responseJson = await response.json();
  //       //setConnected(true)
  //       console.log("response json", responseJson);
  //     }
  //   };
  //   toggleAuthAsync();
  // }, []);
  const loginWithFacebook = async (token) => {
    try {
      // await Facebook.initializeAsync({
      //   appId: "1256149281508808",
      // });
      // const data = await Facebook.logInWithReadPermissionsAsync({
      //   permissions: ["public_profile", "email"],
      // });
      console.log("token from facebook", token);
      Sentry.captureMessage("connect to appId}");
      if (token) {
        try {
          const credential =
            firebase.auth.FacebookAuthProvider.credential(token);
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
            }),
          );
          //userCredentials.user.uid
          //await firebase.login({ credential });
        } catch (e) {
          console.log("error", e);
          Sentry.captureException(e);
        }
      } else {
        Sentry.captureMessage("Facebook data failed");
      }
    } catch (e) {
      //console.log("error", e);
      Sentry.captureException(e);
    }
  };
  //create profile if necessary
  useEffect(() => {
    if (
      isLoaded(auth) &&
      isLoaded(profile) &&
      !isEmpty(auth) &&
      isEmpty(profile)
    ) {
      //create profile
      dispatch(
        createProfile({
          firebaseUserId: auth.id,
          force: false,
        }),
      );
    }
    // const createProfileIfNecessary = async () => {
    //   //const fcbkAuth = await services.getFacebookAuth();
    //   //const fbUser = await services.getFacebookUser(fcbkAuth);
    //   //extract later
    //   //if (isLoaded(userCloudScore) && isEmpty(userCloudScore)) {
    //
    //
    //   //}
    //   return fcbkAuth;
    // };
    //createProfileIfNecessary();
  }, [auth, profile]);
  return (
    <View style={styles.container}>
      {isLoaded(auth) && !isEmpty(auth) ? (
        <UserProfile />
      ) : (
        <>
          <Text style={styles.scoreLabelSection}>
            login to evaluate your score against others
          </Text>
          <LoginButton
            onLogoutFinished={() => console.log("Logged out")}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                if (Platform.OS === "ios") {
                  AuthenticationToken.getAuthenticationTokenIOS().then(
                    (data) => {
                      console.log(data?.authenticationToken);
                      loginWithFacebook(data?.authenticationToken);
                    },
                  );
                } else {
                  AccessToken.getCurrentAccessToken().then((data) => {
                    console.log(data?.accessToken.toString());
                    loginWithFacebook(data?.accessToken.toString());
                  });
                }
              }
            }}
          />
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
              <Icon
                name="facebook"
                size={30}
                color="white"
                type="fontAwesome"
              />
            }
          />
        </>
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
  container: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default Auth;
