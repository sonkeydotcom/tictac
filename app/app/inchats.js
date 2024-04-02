import * as React from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
  Button,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import socket from "./socketService";

export default function inchats() {
  const isPresented = router.canGoBack();
  const [gameName, setGameName] = React.useState("");
  const [joinCode, setJoinCode] = React.useState("");

  const [groupMessage, setGroupMessage] = useState("");
  const [gameId, setGameId] = useState("");
  const [waiting, setWaiting] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [gameCreated, setGameCreated] = useState("");

  useEffect(() => {
    socket.on("group-message", (message) => {
      console.log(message);
      setGroupMessage(message);
    });

    socket.on("game-created", (gameId) => {
      console.log("Game ID:", gameId);
      setGameCreated(gameId);
    });
    return () => {
      socket.off("group-message");
      socket.off("game-created");
    };
  }, [socket]);

  useEffect(() => {
    // Add event listener to handle incoming messages
    socket.on("chat-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up event listener on component unmount
    return () => {
      socket.off("chat-message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") {
      return;
    }
    // Emit the message to the server
    socket.emit("send-message", message);
    setMessage("");
  };

  const newGame = () => {
    socket.emit("new-game");
    socket.on("game-created", (gameId) => {
      setGameCreated(gameId);

      setWaiting(true);
      socket.on("player-joined", () => {
        router.replace({ pathname: "/logical", params: { gameId: gameId } });
      });
    });
  };

  const joinGame = () => {
    if (!gameId) {
      alert("Please enter a join ID");
      Vibration.vibrate();
      return;
    }
    console.log("Joining game", gameId);
    socket.emit("join-game", gameId);
    socket.on("player-joined", () => {
      router.replace({ pathname: "/logical", params: { gameId: gameId } });
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTransparent: true,
          title: "",
        }}
      />
      <LinearGradient
        colors={["#a86b32", "#336e20", "#6e4220"]}
        style={styles.background}
      >
        <KeyboardAvoidingView
          onPress={Keyboard.dismiss}
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
        >
          <View style={styles.card}>
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              inverted
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={(text) => setMessage(text)}
              placeholder="Type your message..."
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    justifyContent: "center",
  },
  background: {
    flex: 1,

    width: "100%",
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
  card: {
    borderRadius: 8,
    padding: 18,

    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "transparent", // Set to "transparent" to hide the border
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
    justifyContent: "center",
    bottom: 0,
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  messageContainer: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
});
