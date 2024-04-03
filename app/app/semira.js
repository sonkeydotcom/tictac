import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import BannerOne from "../components/bannerOne";
import Interstitial from "../components/interstitial";

const semira = () => {
  return (
    <>
      <ImageBackground
        source={require("../assets/bg.jpg")}
        style={styles.containerImg}
      >
        <View style={styles.overlay}>
          <Interstitial />
          <Text style={styles.title}>Feature Coming Soon</Text>
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
            <BannerOne />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default semira;

const styles = StyleSheet.create({
  containerImg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    paddingVertical: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#cccccc",
  },
});
