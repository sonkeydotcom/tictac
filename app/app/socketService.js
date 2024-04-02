import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://192.168.0.5:3000/", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to server");
});


export default socket;
