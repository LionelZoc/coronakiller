##Fun and relaxing board game


#To do

MVP
[] a 6 x 6 board
[] virus appearing randomly on each cell
[] not more than 6 virus at the time

nomenclature:
target:
point:
rank:
multiplayer:

#improvement
rendre anxiogene lorsqu'on se rapproche de la fin du chrono
choose the size of the board
choose the difficulty level
use reel world map to figth the virus
play sound simultaniously when i slash many virus
configure auto updating of google app store from command line
fix permission android issues
control splash screen desapearence
make the game more insteresting with geo feedback
#change ios name (pandemic fighter)
 https://docs.expo.io/distribution/uploading-apps/


#Dev 

to find your ip adress to provide in env for reacttotron: `ipconfig getifaddr en0`
todo, build android bundle rebuil ios archive

provide values to .env file

EXPO_PUBLIC_SENTRY_DSN="your.dsn"
EXPO_PUBLIC_DEVICE_HOST=""


to build the app for expo go in the simulator: 
#to lunch app in simulator
`make build-sim-ios`
or manually type `expo build:ios -t simulator`
https://forums.expo.io/t/how-do-i-run-my-standalone-app-on-my-phone/3143

you can also build locally instead of with eas with:
`make build-local-sim-ios`


to see icons: https://oblador.github.io/react-native-vector-icons/

astuces

in expo terminal open simulator ios and tap shitf i to choose on which simulator i want to test


Jouez à ce jeux fun et relaxant qui vous fait combattre une pandemie, et challenger vos amis , depuis votre canapé ou dans le métro , juste avec vos doigts
#privacy policy
https://vira-ert.flycricket.io/privacy.html
https://vira-ert.flycricket.io/terms.html



#facebook redirect url
https://viralert-dev.firebaseapp.com/__/auth/handler


firebase init
https://firebase.google.com/docs/cli#mac-linux-npm


firebase projects:list
Run firebase firestore:indexes to save indexes

save rules https://stackoverflow.com/questions/52778542/how-to-export-security-and-index-rules-from-firestore


migrate to expo 42

good reading: 
https://blog.expo.dev/the-new-expo-cli-f4250d8e3421

https://expo.dev/changelog/2024/05-07-sdk-51

In addition to the most recent release notes, you should go over the breaking changes from skipped releases:
- https://expo.dev/changelog/2024/01-18-sdk-50
- https://blog.expo.dev/expo-sdk-49-c6d398cdf740
- https://blog.expo.dev/expo-sdk-48-ccb8302e231
- https://blog.expo.dev/expo-sdk-47-a0f6f5c038af
- https://blog.expo.dev/expo-sdk-46-c2a1655f63f7
- https://blog.expo.dev/expo-sdk-45-f4e332954a68
- https://blog.expo.dev/expo-sdk-44-4c4b8306584a
- https://blog.expo.dev/expo-sdk-43-aa9b3c7d5541
- https://blog.expo.io/expo-sdk-42-579aee2348b6

sentry-expo is no longer supported, use @sentry/react-native instead
update expo-facebook to https://docs.expo.dev/guides/facebook-authentication/ (in progress)
expo-app-loading deprecated read https://docs.expo.dev/versions/latest/sdk/splash-screen/ done
create developper account on google 
create meta developper account (done)
@react-native-community/masked-view => 
remove react-navigation
use expo-router
update sentry
add typescript
remove prop-types
todo : put secrets in eas 
add env file
move firebase config keys to env or better

i should move app.js content mainly in _layout.js
test the initialroutename of the drawer with https://github.com/expo/router/issues/428
maybe i should move tabs in a (tabs) and add an index at the root to handle the redirection manually
release channel did not work : https://stackoverflow.com/questions/75928198/converting-expo-classics-release-channel-to-eas
https://stackoverflow.com/questions/73561558/expo-eas-how-to-link-eas-update-branch-with-build-channel/73723359#73723359

create a development build : https://docs.expo.dev/develop/development-builds/create-a-build/
i was able to install the provisionning profile on Jo phone but not on mine, so i will probably clean my storage to see later

j'ai un problème avec les version de eslint ce qui fait que je ne capte pas les erreurs. 
il faut fixer ça puis relancer le build en destination du simulateur

next: migrate to typescript and remove prop-types
improve assets loading : https://docs.expo.dev/develop/user-interface/assets/

when i clean the return of the layout the code starts to work
  //i don't know if it's the view that hide the slot , this is not necessarily true.

if i can't maintain the splascreen as i went i should create a second dynamic fake splashscreen that fuse into the view at start 

todo: migrate to native firebase later in the project
migrate from drawer to a modal that come bottom to top , like in ios


navigation/ (only the navigation logic)

presentation/
    uikit/
    theme/
    component/
        users/
        game/
    container/

domain/ (mainly for model: it's optional)
    users/
    game/

infrastructure/
    context/
    hooks/ (really important to expose high level method that use infrastructure)
    services/
    repositories/
        users/
        game/
        auth/
    api/
    redux/
    firebase/
    utils/

application/(hooks of methods that will reuse infrastructure methods)


shared/ (does not necessarly need to be in a shared)
    constants/
    types/
