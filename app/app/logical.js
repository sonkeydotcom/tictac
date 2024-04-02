import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  ImageBackground,
  Image,
  Pressable,
  TextInput,
  SafeAreaView,
  Button,
} from "react-native";
import Modal from "../components/modal";
import { router, useGlobalSearchParams, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import CustomModal from "../components/customModal";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import {
  Octicons,
  AntDesign,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./socketService";

const logical = () => {
  const { gameMode } = useGlobalSearchParams();
  const { gameId } = useLocalSearchParams();
  console.log("winner", gameId);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [playerXScore, setPlayerXScore] = useState(0);
  const [playerOScore, setPlayerOScore] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [xMoves, setXMoves] = useState(0);
  const [playerOne, setPlayerOne] = useState({ id: "", symbol: "" });
  const [playerTwo, setPlayerTwo] = useState({ id: "", symbol: "" });
  const [oMoves, setOMoves] = useState(0);
  const [gameCreated, setGameCreated] = useState("");
  const currentSquares = history[currentMove];
  const [lastPlayer, setLastPlayer] = useState(null);

  const [currentMove, setCurrentMove] = useState(0);

  const [justRestarted, setJustRestarted] = useState(false);
  const [multiplayer, setMultiplayer] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [player, setPlayer] = useState(null);
  const [testMessage, setTestMessage] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(socket.id);
  const [gameStarted, setGameStarted] = useState(false);

  const [roomId, setRoomId] = useState(null); // Stores the room ID for multiplayer

  console.log("playerOne", playerOne);
  console.log("currentPlayer", currentPlayer);
  useEffect(() => {
    socket.on("group-message", (message) => {
      console.log(message);
    });

    socket.on("test-message", (message) => {
      console.log(message);
    });

    socket.on("semira", ({ gameId, players }) => {
      const playerOneData = players.find((player) => "playerOne" in player);
      const playerTwoData = players.find((player) => "playerTwo" in player);

      if (playerOneData) {
        setPlayerOne({ id: playerOneData.playerOne, symbol: "X" });
      }

      if (playerTwoData) {
        setPlayerTwo({ id: playerTwoData.playerTwo, symbol: "O" });
      }
    });

    socket.on("move", (data) => {
      console.log(data);
      setBoard(data.squares);
      setCurrentPlayer(data.currentPlayer);
      setXIsNext(!data.xIsNext);
      setXMoves(data.xMoves);
      setOMoves(data.oMoves);
    });

    return () => {
      socket.off("group-message");
      socket.off("test-message");
      socket.off("move");
      socket.off("semira");
    };
  }, [socket]);

  console.log(playerOne, playerTwo);

  useEffect(() => {
    setCurrentPlayer(playerOne.id);
  }, [playerOne]);

  const handleTest = () => {
    socket.emit("test-message", testMessage, gameId);
  };

  const handleGoBack = () => {
    Alert.alert("Go back", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => router.navigate("inter"),
      },
    ]);
  };

  const winSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("../assets/humm.wav"));
      await soundObject.playAsync();
    } catch (error) {
      console.error("Failed to load the sound", error);
    }
  };

  const btnSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("../assets/dish.wav"));
      await soundObject.playAsync();
    } catch (error) {
      console.error("Failed to load the sound", error);
    }
  };

  const playSound = async (moveType) => {
    let soundFile = "";

    // Select the sound file based on the move type
    if (moveType === "X") {
      soundFile = require("../assets/crunchy.wav");
    } else if (moveType === "O") {
      soundFile = require("../assets/soda.mp3");
    }

    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync(soundFile);
      await soundObject.playAsync();
    } catch (error) {
      console.error("Failed to load the sound", error);
    }
  };

  const handlePlay = async (nextSquares) => {
    const nextHistory = history.slice(0, currentMove + 1);
    setHistory([...nextHistory, nextSquares]);
    setCurrentMove(currentMove + 1);
    setXIsNext(!xIsNext);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null);
  };

  const handleClick = (i) => {
    const squares = [...board];

    // If the game hasn't started and the current player is not player one, return early
    if (socket.id !== currentPlayer) {
      alert("Woop");
      return;
    } else if (!gameStarted) {
      setGameStarted(true); // Set gameStarted to true on player one's move
      setCurrentPlayer(
        currentPlayer === playerOne.id ? playerTwo.id : playerOne.id
      );
    }

    // If it's not the current player's turn, return early
    if (currentPlayer !== (xIsNext ? playerOne.id : playerTwo.id)) {
      alert("It's not your turn");
      return;
    }

    console.log(`currentPlayer: ${currentPlayer} | xIsNext: ${xIsNext}`);

    // Rest of the existing logic...
    console.log("gameStarted", gameStarted);

    // If there's already a winner, ignore further clicks
    if (calculateWinner(squares)) {
      return;
    }

    // Handle maximum moves and removing/dropping piece
    if ((xIsNext && xMoves >= 3) || (!xIsNext && oMoves >= 3)) {
      if (xIsNext && squares[i] === "X") {
        squares[i] = null;
        setBoard(squares);
        setXMoves(xMoves - 1);
      } else if (!xIsNext && squares[i] === "O") {
        squares[i] = null;
        setBoard(squares);
        setOMoves(oMoves - 1);
      }

      return;
    }

    // Regular move logic if maximum moves haven't been reached
    if (squares[i] === null) {
      squares[i] = xIsNext ? "X" : "O";
      setBoard(squares);
      if (xIsNext) {
        setXMoves(xMoves + 1);
      } else {
        setOMoves(oMoves + 1);
      }

      setXIsNext(!xIsNext);
      setCurrentPlayer(xIsNext ? playerTwo.id : playerOne.id);

      console.log("currentPlayer after play", currentPlayer);
    }

    // Switch to the other player

    const bleh = squares[i];
    socket.emit("move", {
      squares,
      bleh,
      xIsNext,
      xMoves,
      oMoves,
      player,
      currentPlayer,
    });
  };

  const restartGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext((prevXIsNext) => !prevXIsNext); // Toggle xIsNext
    setJustRestarted(true);
    setShowModal(false);
  };

  const renderSquare = (i) => {
    return (
      <View style={styles.squareContainer} key={i}>
        <TouchableOpacity
          disabled={
            gameStarted &&
            currentPlayer !== (xIsNext ? playerOne.id : playerTwo.id)
          }
          style={styles.square}
          onPress={() => handleClick(i)}
        >
          <Text style={styles.squareText}>
            {board[i] === "X" ? (
              <MaterialCommunityIcons name="close" size={65} color="white" />
            ) : board[i] === "O" ? (
              <MaterialCommunityIcons
                name="circle-outline"
                size={60}
                color="red"
              />
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every((square) => square)) {
    status = "Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <StatusBar hidden={true} />
      <SafeAreaView></SafeAreaView>
      <ImageBackground
        source={require("../assets/bg.jpg")}
        style={styles.imageBg}
      >
        <View style={styles.container}>
          <View style={styles.scoreSheet}>
            <Text
              style={[
                styles.scoreText,
                {
                  borderBottomColor: currentSquares === "X" ? "red" : "blue",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pressable
                  onPress={() => {
                    router.push("inchats");
                  }}
                  style={[
                    styles.avata,
                    xIsNext ? { borderColor: "orange" } : {},
                  ]}
                >
                  {multiplayer ? (
                    <Ionicons
                      name="person-circle-outline"
                      size={30}
                      color={xIsNext ? "orange" : "white"}
                    />
                  ) : (
                    <Octicons
                      name="person"
                      size={30}
                      color={xIsNext ? "orange" : "white"}
                    />
                  )}
                </Pressable>
                <View>
                  <Text style={styles.scoreText}> {playerXScore} </Text>
                  <Text style={styles.scoreText}> X </Text>
                </View>
              </View>
            </Text>
            <Text style={styles.separator}> VS </Text>
            <Text style={styles.scoreText}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={styles.scoreText}> {playerOScore} </Text>
                  <Text style={styles.scoreText}> O </Text>
                </View>
                <Pressable
                  onPress={() => {
                    alert("clicked");
                  }}
                  style={[
                    styles.avata,
                    !xIsNext ? { borderColor: "orange" } : {},
                  ]}
                >
                  {multiplayer ? (
                    <Octicons
                      name="person"
                      size={30}
                      color={!xIsNext ? "orange" : "white"}
                    />
                  ) : (
                    <AntDesign
                      name="iconfontdesktop"
                      size={30}
                      color={!xIsNext ? "orange" : "white"}
                    />
                  )}
                </Pressable>
              </View>
            </Text>
          </View>
          <View style={styles.board}>
            <View style={styles.row}>
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
            </View>
            <View style={styles.row}>
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
            </View>
            <View style={styles.row}>
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </View>
          </View>
          <Text style={styles.status}>{status}</Text>

          {/*<TouchableOpacity style={styles.button} onPress={toggleMode}>
            <Text style={styles.buttonText}>
              {multiplayer
                ? "Switch to Single Player"
                : "Switch to Multiplayer"}
            </Text>
              </TouchableOpacity>*/}
        </View>
      </ImageBackground>
      <View>
        <Text>Ads here</Text>
      </View>
      <ImageBackground source={require("../assets/bar.png")}>
        <View style={styles.bottom}>
          <Pressable onPress={handleGoBack}>
            <Text style={styles.bottomText}>
              {" "}
              <AntDesign name="leftcircleo" size={30} color="black" />{" "}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              restartGame();
              btnSound();
            }}
          >
            <Text style={styles.bottomText}>
              {" "}
              <MaterialIcons name="refresh" size={30} color="black" />{" "}
            </Text>
          </Pressable>
        </View>
      </ImageBackground>

      <CustomModal
        visible={showModal}
        restartGame={restartGame}
        multiplayer={multiplayer}
        winner={winner}
        status={status}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    padding: 20,
  },
  imageBg: {
    flex: 2,
    resizeMode: "cover",
    justifyContent: "center",
  },
  mode: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  bottomBg: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomText: {
    textTransform: "uppercase",
    color: "#333333",
    fontWeight: "bold",
    fontSize: 18,
  },
  scoreSheet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 5,
    width: "100%",
  },
  scoreText: {
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: "bold",
    color: "#ccc",
  },
  separator: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    marginBottom: 5,
    fontSize: 24,
    fontFamily: "Pacifico_400Regular",
    color: "#333333",
  },
  board: {
    marginBottom: 20,

    borderWidth: 1,

    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#999",
    margin: 2,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
  },
  squareText: {
    fontSize: 36,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  avata: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 3,
    padding: 5,
    borderColor: "white",
  },
});

export default logical;