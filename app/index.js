import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

const index = () => {
  const handlePress = () => {
    router.navigate("game");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Open up App.js to start working on your app!</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text> Play </Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
