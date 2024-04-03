import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("https://tictac-fle8.onrender.com/", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server");
});

export default socket;
