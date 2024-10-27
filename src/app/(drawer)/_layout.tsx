import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ROUTES from "constants/routes";
import { Icon } from "react-native-elements";
import DrawerIcon from "uikit/navigation/DrawerIcon";
import { useTheme } from "theme/themeProvider";

const RootLayout = () => {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ route }) => ({
          headerLeft: () => <DrawerIcon />,
          //drawerLabel: "boom",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: "black",
          headerShown: true,
          drawerIcon: ({ focused, color, size }) => {
            let iconName: string;
            let iconType = "material";
            switch (route.name) {
              case ROUTES.GAME_PRESENTATION.relativePath:
                iconName = ROUTES.GAME_PRESENTATION.drawerIcon;
                iconType = ROUTES.GAME_PRESENTATION.iconType;
                break;
              case ROUTES.BOARD.relativePath:
                iconName = ROUTES.BOARD.drawerIcon;
                iconType = ROUTES.BOARD.iconType;
                break;
              case ROUTES.LEADERBOARD.relativePath:
                iconName = ROUTES.LEADERBOARD.drawerIcon;
                iconType = ROUTES.LEADERBOARD.iconType;
                break;
              case ROUTES.TARGET_SELECTION.relativePath:
                iconName = ROUTES.TARGET_SELECTION.drawerIcon;
                iconType = ROUTES.TARGET_SELECTION.iconType;
                break;
            }

            return (
              <Icon name={iconName} type={iconType} size={size} color={color} />
            );
          },
          drawerActiveTintColor: "tomato", // Active icon color
          drawerInactiveTintColor: "gray", // Inactive icon color
        })}
      >
        <Drawer.Screen
          name={ROUTES.BOARD.relativePath} // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Board",
            title: "Board",
          }}
        />
        <Drawer.Screen
          options={{
            drawerLabel: "Game Presentation",
            title: "Presentation",
            headerShown: true,
          }}
          name={ROUTES.GAME_PRESENTATION.relativePath}
        />
        <Drawer.Screen
          options={{
            drawerLabel: "Target Selection",
            title: "selection",
          }}
          name={ROUTES.TARGET_SELECTION.relativePath}
        />
        <Drawer.Screen
          name={ROUTES.LEADERBOARD.relativePath}
          options={{
            drawerLabel: "Leaderboard",
            title: "Leaderboard",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
