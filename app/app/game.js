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
  SafeAreaView,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
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
import Banner from "../components/banner";
import Interstitial from "../components/interstitial";
import Intershow from "../components/intershow";

const Game = () => {
  const { gameMode } = useGlobalSearchParams();

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [justRestarted, setJustRestarted] = useState(false);
  const [multiplayer, setMultiplayer] = useState(true);
  const currentSquares = history[currentMove];
  const [playerXScore, setPlayerXScore] = useState(0);
  const [playerOScore, setPlayerOScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [tiesScore, setTiesScore] = useState(0);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInter, setShowInter] = useState(false);

  useEffect(() => {
    // Set the game mode based on the selected option
    if (gameMode === "singlePlayer") {
      console.log("Single player mode");
      // Set game mode to single player
      setMultiplayer(false);
    } else if (gameMode === "multiPlayer") {
      // Set game mode to multi player
      setMultiplayer(true);
      console.log("Multiplayer mode");
    }
  }, [gameMode]);

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

  const handleClick = async (i) => {
    const squares = [...currentSquares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    //Alert.alert("Invalid move", "It's not your turn!");
    squares[i] = xIsNext ? "X" : "O";
    handlePlay(squares);
    const winner = calculateWinner(squares);

    // Find AI's move
    if (!multiplayer) {
      squares[i] = "X"; // Always set the player's move first
      handlePlay(squares);

      const winner = calculateWinner(squares);
      if (winner) {
        return; // If there's a winner, no need for AI to play
      }
      setTimeout(() => {
        const bestMove = calculateBestMove(squares, "O");
        squares[bestMove] = "O";
        handlePlay(squares);
        setXIsNext(true);
      }, 500);
    }
  };

  const calculateBestMove = (squares, player) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = player;
        const score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (squares, depth, isMaximizing) => {
    const winner = calculateWinner(squares);
    if (winner) {
      return winner === "X" ? -10 + depth : 10 - depth;
    }
    if (isBoardFull(squares)) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = "O";
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = "X";
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const restartGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext((prevXIsNext) => !prevXIsNext); // Toggle xIsNext
    setJustRestarted(true);
    setShowModal(false);
  };

  const toggleMode = () => {
    setMultiplayer(!multiplayer);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true); // Toggle xIsNext
  };

  useEffect(() => {
    if (!xIsNext && !multiplayer && justRestarted) {
      console.log("AI starts");
      const squares = [...currentSquares];
      const bestMove = calculateBestMove(squares, "O");
      squares[bestMove] = "O";
      handlePlay(squares);
      setXIsNext(true);
    }
  }, [justRestarted]);

  const renderSquare = (i) => {
    let borderStyles = {};
    if (i % 3 !== 2) {
      borderStyles.borderRightWidth = 2;
    }
    if (Math.floor(i / 3) !== 2) {
      borderStyles.borderBottomWidth = 2;
    }
    return (
      <TouchableOpacity
        style={[styles.square, borderStyles]}
        key={i}
        onPress={() => handleClick(i)}
      >
        <Text style={styles.squareText}>
          {currentSquares[i] === "X" ? (
            <MaterialCommunityIcons name="close" size={65} color="white" />
          ) : currentSquares[i] === "O" ? (
            <MaterialCommunityIcons
              name="circle-outline"
              size={60}
              color="red"
            />
          ) : null}
        </Text>
      </TouchableOpacity>
    );
  };

  const moves = history.map((squares, move) => {
    const description = move ? `Go to move #${move}` : "Go to game start";
    return (
      <TouchableOpacity key={move} onPress={() => jumpTo(move)}>
        <Text>{description}</Text>
      </TouchableOpacity>
    );
  });

  useEffect(() => {
    const winner = calculateWinner(currentSquares);
    if (winner) {
      if (winner === "X") {
        setPlayerXScore(playerXScore + 1);
        setShowModal(true);
        winSound();
      } else if (multiplayer && winner === "O") {
        setPlayerOScore(playerOScore + 1);
        setShowModal(true);
        winSound();
      } else if (!multiplayer) {
        setAiScore(aiScore + 1);
      } else {
        // Handle the case when there is no winner or when the AI wins in multiplayer mode
        // You might want to show a different message or handle the logic differently here
        setShowModal(true);
      }
      Vibration.vibrate(1000);
    } else if (isBoardFull(currentSquares)) {
      setTiesScore(tiesScore + 1);
      Vibration.vibrate(1000);
      setTimeout(() => {
        setCurrentMove(0);
        setXIsNext((prevXIsNext) => !prevXIsNext);
      }, 2000);
    }
  }, [currentSquares]);

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull(currentSquares)) {
    status = "It's a draw!";
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
        <Interstitial />
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
                <View
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
                </View>
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
                <View
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
                </View>
              </View>
            </Text>
          </View>
          <View style={styles.board}>
            {[0, 1, 2].map((row) => (
              <View key={row} style={styles.row}>
                {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
              </View>
            ))}
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
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Banner />
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
    marginTop: 20,
    justifyContent: "center",
    marginBottom: 20,
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

export default Game;
