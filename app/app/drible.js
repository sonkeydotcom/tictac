import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Drab from "../components/drab";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const arr = new Array(25).fill(0).map((_, i) => i + 1);

const Drible = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Drab />
    </GestureHandlerRootView>
  );
};

export default Drible;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: "blue",
  },
});
