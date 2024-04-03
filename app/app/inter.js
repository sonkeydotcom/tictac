import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Pressable } from "react-native";
import Stack from "expo-router";

import {
  MaterialCommunityIcons,
  Octicons,
  AntDesign,
} from "@expo/vector-icons";
import BannerFive from "../components/bannerFive";

import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";

import { Asset } from "expo-asset";

// Preload the image
Asset.fromModule(require("../assets/bg.jpg")).downloadAsync();
Asset.fromModule(require("../assets/bar.png")).downloadAsync();

// Show the app open ad when user brings the app to the foreground.

const Inter = () => {
  const { gameMode } = useGlobalSearchParams();

  const [classic, setClassic] = useState(false);

  useEffect(() => {
    // Set the game mode based on the selected option
    if (gameMode === "classic") {
      console.log("Single player mode");
      // Set game mode to single player
      setClassic(true);
    } else if (gameMode === "logical") {
      // Set game mode to multi player
      setClassic(false);
      console.log("Multiplayer mode");
    }
  }, [gameMode]);

  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar hidden={true} />

      <ImageBackground
        source={require("../assets/bg.jpg")}
        style={styles.containerImg}
      >
        <View style={styles.overlay}>
          {classic ? (
            <>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  router.navigate({
                    pathname: "game",
                    params: { gameMode: "singlePlayer" },
                  });
                }}
              >
                <Octicons name="person" size={24} color="white" />
                <Text style={styles.onePlayer}> VS </Text>
                <AntDesign name="iconfontdesktop" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  router.navigate({
                    pathname: "game",
                    params: { gameMode: "multiPlayer" },
                  });
                }}
              >
                <Octicons name="person" size={24} color="white" />
                <Text style={styles.twoPlayers}> Two players </Text>
                <Octicons name="person" size={24} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  router.navigate({
                    pathname: "network",
                    params: { gameMode: "multiPlayer" },
                  });
                }}
              >
                <Text style={styles.twoPlayers}> Network play </Text>
                <Octicons name="broadcast" size={26} color="white" />
              </TouchableOpacity>
            </>
          )}

          <View
            style={{
              bottom: 0,
              position: "absolute",
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BannerFive />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Inter;

const styles = StyleSheet.create({
  containerImg: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    justifyContent: "center",
  },
  btn: {
    borderRadius: 8,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    paddingVertical: 28,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
    justifyContent: "center",
  },
  title: {
    fontSize: 53,
    fontWeight: "bold",
    color: "#FFDB58",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 20,
    height: "50%",
    width: "80%",
    backgroundColor: "#A1662F",
    justifyContent: "center",
    justifyContent: "center",
    padding: 20,
  },

  bottomBg: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomText: {
    textTransform: "uppercase",
    color: "#333333",
    fontWeight: "bold",
    fontSize: 18,
  },
  onePlayer: {
    color: "#FFDB58", // Example color for one player text
    textTransform: "uppercase",
    fontSize: 26,
    marginVertical: 10,
  },
  twoPlayers: {
    color: "#999999", // Example color for two players text
    fontSize: 26,
    marginVertical: 10,
    textTransform: "uppercase",
  },

  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 36,
    marginVertical: 10,
  },
});
