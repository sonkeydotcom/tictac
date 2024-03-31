import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { io } from "socket.io-client";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const TicTacToe = () => {
  const socket = io("http://192.168.0.5:3000/", { transports: ["websocket"] });
  const [gameId, setGameId] = useState("");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xMoves, setXMoves] = useState(0);
  const [oMoves, setOMoves] = useState(0);
  const [gameCreated, setGameCreated] = useState("");

  const [currentMove, setCurrentMove] = useState(0);

  const [justRestarted, setJustRestarted] = useState(false);
  const [multiplayer, setMultiplayer] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [player, setPlayer] = useState(null);

  const [roomId, setRoomId] = useState(null); // Stores the room ID for multiplayer

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("game-created", (gameId) => {
      console.log("Game ID:", gameId);
      setGameCreated(gameId);
    });

    socket.on("join-game", (gameId) => {
      console.log("Joining game", gameId);
    });

    socket.on("player-joined", () => {
      console.log("Player joined");
    });

    socket.on("game-data", (data) => {
      console.log("Game data:", data);
    });

    socket.on("play", (data) => {
      setBoard(data.board);
      setXIsNext(data.xIsNext);
      setXMoves(data.xMoves);
      setOMoves(data.oMoves);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const newGame = () => {
    socket.emit("new-game");
  };

  const joinGame = () => {
    if (!gameId) {
      alert("Please enter a game ID");
      return;
    }
    socket.emit("join-game", gameId);
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

  const handleClick = (i) => {
    const squares = [...board];
    if (calculateWinner(squares)) {
      return; // If there's already a winner, ignore further clicks
    }
    socket.emit("play", { squares: squares, xMoves: xMoves, oMoves: oMoves });

    // Handle maximum moves and removing/dropping piece
    if ((xIsNext && xMoves >= 3) || (!xIsNext && oMoves >= 3)) {
      if (xIsNext && squares[i] === "X") {
        squares[i] = null;
        setBoard(squares);
        setXMoves(xMoves - 1);
        return;
      } else if (!xIsNext && squares[i] === "O") {
        squares[i] = null;
        setBoard(squares);
        setOMoves(oMoves - 1);
        return;
      }
      return;
    }

    if (!xIsNext && squares[i] === "O") {
      Alert.alert(" X wait for your turn ");
    }

    // Regular move logic if maximum moves haven't been reached
    squares[i] = xIsNext ? "X" : "O";
    setBoard(squares);
    setXIsNext(!xIsNext);
    if (xIsNext) {
      setXMoves(xMoves + 1);
    } else {
      setOMoves(oMoves + 1);
    }
  };

  const renderSquare = (i) => {
    return (
      <View style={styles.squareContainer} key={i}>
        <TouchableOpacity style={styles.square} onPress={() => handleClick(i)}>
          <Text style={styles.squareText}>
            {board[i] === "X" ? (
              <MaterialCommunityIcons name="close" size={24} color="black" />
            ) : board[i] === "O" ? (
              <MaterialCommunityIcons
                name="circle-outline"
                size={24}
                color="black"
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
    <View style={{ flex: 1 }}>
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
        <Text style={styles.status}>{status}</Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  board: {
    borderWidth: 2,
    borderColor: "black",
  },
  row: {
    flexDirection: "row",
  },
  squareContainer: {
    width: 100,
    height: 100,
  },
  square: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  squareText: {
    fontSize: 32,
  },
  drag: {
    height: 100,
    width: 100,
    borderColor: "red",
    borderWidth: 1,
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

export default TicTacToe;
