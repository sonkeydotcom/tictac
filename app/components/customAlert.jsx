import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const CustomAlert = ({ title, gameId }) => {
  return (
    <View style={styles.container}>
      <View style={styles.alert}>
        <ActivityIndicator color="white" size="large" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.gameId}>Game ID: {gameId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
    width: "100%",
  },
  alert: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5, // for Android
  },
  title: {
    fontSize: 18,

    marginTop: 10,
    color: "white",
  },
  gameId: {
    fontSize: 16,

    color: "white",
  },
});

export default CustomAlert;
