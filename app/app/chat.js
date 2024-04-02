import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  router,
  useLocalSearchParams,
  useGlobalSearchParams,
} from "expo-router";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CustomAlert from "../components/customAlert";

const socket = io("http://192.168.0.5:3000/", { transports: ["websocket"] });

const chat = () => {
  const [messages, setMessages] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const [gameId, setGameId] = useState("");
  const [waiting, setWaiting] = useState(false);

  const [gameCreated, setGameCreated] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("group-message", (message) => {
      console.log(message);
      setGroupMessage(message);
    });

    socket.on("game-created", (gameId) => {
      console.log("Game ID:", gameId);
      setGameCreated(gameId);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const newGame = () => {
    socket.emit("new-game");
    socket.on("game-created", (gameId) => {
      setGameCreated(gameId);
      setWaiting(true);
      socket.on("player-joined", () => {
        router.push({ pathname: "/games", params: { gameId: gameId } });
      });
    });
  };
  const joinGame = () => {
    if (!gameId) {
      alert("Please enter a game ID");
      return;
    }
    console.log("Joining game", gameId);
    socket.emit("join-game", gameId);
    socket.on("player-joined", () => {
      router.push({ pathname: "/games", params: { gameId: gameId } });
    });
  };

  return (
    <>
      {waiting && <CustomAlert title="Waiting.." gameId={gameCreated} />}
      <View style={styles.container}>
        <View>
          <Text>Game ID: {gameCreated}</Text>
          <TouchableOpacity style={styles.btn} onPress={newGame}>
            <Text style={styles.btnText}>Create new game</Text>
          </TouchableOpacity>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text> OR </Text>
          </View>

          <TextInput
            placeholder="Enter game ID"
            value={gameId}
            onChangeText={(text) => setGameId(text)}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btn} onPress={joinGame}>
            <Text style={styles.btnText}>Join!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.msgContainer}>
          <Text> {groupMessage}</Text>
        </View>
      </View>
    </>
  );
};

export default chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  msgContainer: {
    borderWidth: 1,
    borderColor: "#000",
    width: "80%",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  screen: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 12,
    width: "80%",
  },

  input: {
    borderWidth: 1,
    borderColor: "#000",
    width: "80%",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});
