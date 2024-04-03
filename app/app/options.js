import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Pressable } from "react-native";
import BannerTwo from "../components/bannerTwo";

// Show the app open ads when user brings the app to the foreground.

const options = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground
        source={require("../assets/bg.jpg")}
        style={styles.containerImg}
      >
        <View style={styles.overlay}>
          <View>
            <Text style={styles.title}> Options</Text>
          </View>
          <View style={styles.options}>
            <Text style={styles.text}>Sound</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View style={styles.options}>
            <Text style={styles.text}>Notification </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
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
            <BannerTwo />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default options;

const styles = StyleSheet.create({
  containerImg: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    justifyContent: "center",
  },
  overlay: {
    paddingVertical: 28,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
  },
  title: {
    fontSize: 53,
    fontWeight: "bold",
    color: "#FFDB58",
  },
  text: {
    color: "#999999", // Example color for one player text
    textTransform: "uppercase",
    fontSize: 22,
    marginVertical: 10,
    marginHorizontal: 4,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
});
