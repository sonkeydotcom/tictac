import { Stack, router, Tabs } from "expo-router";
import { Ionicons, Feather, EvilIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="options"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="game"
          title=""
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="semira"
          title=""
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="inter"
          headerShown={false}
          headerTransparent={true}
          options={{
            headerRight: () => (
              <Ionicons
                name="settings-outline"
                size={28}
                color="white"
                style={{ marginRight: 10, marginTop: 10 }}
                onPress={() => router.navigate("options")}
              />
            ),
            headerLeft: () => (
              <Feather
                name="arrow-left-circle"
                size={30}
                color="white"
                style={{ marginLeft: 10, marginTop: 10 }}
                onPress={() => router.navigate("/")}
              />
            ),
            title: "",
            headerShadowVisible: false,
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              marginTop: 20,
            },
            headerShadowVisible: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="logical"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="network"
          options={{
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="inchats"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
