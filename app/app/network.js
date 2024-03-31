import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Route,
  router,
  Stack,
  Link,
  useLocalSearchParams,
  useGlobalSearchParams,
} from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import CustomAlert from "../components/customAlert";
import io from "socket.io-client";

const socket = io("http://192.168.0.5:3000/", { transports: ["websocket"] });

export default function linear() {
  const isPresented = router.canGoBack();
  const [gameName, setGameName] = React.useState("");
  const [joinCode, setJoinCode] = React.useState("");
  const [messages, setMessages] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const [gameId, setGameId] = useState("");
  const [waiting, setWaiting] = useState(false);

  const [gameCreated, setGameCreated] = useState("");

  const createGame = () => {
    // Logic for creating a game
    console.log("Creating game with name:", gameName);
    setWaiting(true);
  };

  const joinGame = () => {
    // Logic for joining a game
    console.log("Joining game with code:", joinCode);
    router.push("logical", { joinCode });
  };

  return (
    <View style={styles.container}>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTransparent: true,
          title: "",
        }}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={["#a86b32", "#336e20", "#6e4220"]}
        style={styles.background}
      />
      {waiting && (
        <CustomAlert title="Waiting for joins.." gameId={gameCreated} />
      )}
      <View>
        <MaterialIcons name="broadcast-on-home" size={53} color="#ccc" />
      </View>
      <View style={styles.card}>
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={[styles.button, { width: "" }]}
            onPress={createGame}
          >
            <Text style={styles.text}>Host game</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.1)",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter join code"
            onChangeText={(text) => setJoinCode(text)}
            value={joinCode}
          />
          <TouchableOpacity style={styles.button} onPress={joinGame}>
            <Text style={styles.text}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: "#4c669f",
    alignItems: "center",

    borderRadius: 5,
  },
  text: {
    fontSize: 15,
    color: "#fff",
  },
  overlay: {
    paddingVertical: 28,
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    height: "100%",
  },
  card: {
    borderRadius: 8,
    width: 280,

    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent", // Set to "transparent" to hide the border
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 4,
  },
});
