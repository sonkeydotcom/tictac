import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Pressable } from "react-native";

import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";

import { Asset } from "expo-asset";
import CustomAlert from "../components/customAlert";

// Preload the image
Asset.fromModule(require("../assets/bg.png")).downloadAsync();
Asset.fromModule(require("../assets/bar.png")).downloadAsync();
Asset.fromModule(require("../assets/fries.png")).downloadAsync();
Asset.fromModule(require("../assets/pizza.png")).downloadAsync();

// Show the app open ad when user brings the app to the foreground.

const index = () => {
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
          <Image
            style={{ marginVertical: 38, height: 140, width: 160 }}
            source={require("../assets/download.png")}
          />

          <TouchableOpacity
            onPress={() => {
              router.replace({
                pathname: "inter",
                params: { gameMode: "classic" },
              });
            }}
          >
            <Text style={styles.onePlayer}> Classic </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.navigate({
                pathname: "network",
                params: { gameMode: "logical" },
              });
            }}
          >
            <Text style={styles.twoPlayers}> logical </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.navigate("options");
            }}
          >
            <Text style={styles.options}> Options </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate("semira")}>
            <Text style={styles.removeAds}> Remove Ads </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              router.navigate("logical");
            }}
          >
            <Text style={styles.quit}> Quit </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default index;

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
    fontSize: 17,
  },
  onePlayer: {
    color: "#FFDB58", // Example color for one player text
    textTransform: "uppercase",
    fontSize: 24,
    marginVertical: 10,
  },
  twoPlayers: {
    color: "#999999", // Example color for two players text
    textTransform: "uppercase",
    fontSize: 24,
    marginVertical: 10,
  },
  options: {
    color: "#808000", // Example color for options text
    textTransform: "uppercase",
    fontSize: 24,

    marginVertical: 10,
  },
  removeAds: {
    color: "#cccccc", // Example color for remove ads text
    textTransform: "uppercase",
    fontSize: 24,
    marginVertical: 10,
  },
  quit: {
    color: "#FF6347", // Example color for quit text
    textTransform: "uppercase",
    fontSize: 24,
    marginVertical: 10,
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
