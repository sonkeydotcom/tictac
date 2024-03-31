import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { io } from "socket.io-client";

const socket = io("http://192.168.0.5:3000/", { transports: ["websocket"] });

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerOne, setPlayerOne] = useState({ id: "", symbol: "" });
  const [playerTwo, setPlayerTwo] = useState({ id: "", symbol: "" });
  const [xIsNext, setXIsNext] = useState(true);
  const [playCount, setPlayCount] = useState(0);

  const [lastId, setLastId] = useState(null);

  useEffect(() => {
    socket.on("move", (index) => {
      handleMove(index);
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

    return () => {
      socket.off("semira");
      socket.off("gameState");
      socket.off("move");
    };
  });

  console.log(playerOne, playerTwo);

  const handleMove = (index) => {
    if (board[index] === null) {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setPlayer(player === "X" ? "O" : "X");
      setCurrentPlayer(socket.id)
    }
  };

  const makeMove = (index) => {
    if (currentPlayer === socket.id) {
      alert(" you just played");
      return;
    }
    if (board[index] === null) {
      socket.emit("move", index);
      handleMove(index);
    }
    console.log(socket.id);
  };

  const renderSquare = (index) => {
    return (
      <TouchableOpacity style={styles.square} onPress={() => makeMove(index)}>
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Tic Tac Toe</Text>
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
  );
};

export default TicTacToe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  board: {
    borderWidth: 1,
    borderColor: "black",
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  squareText: {
    fontSize: 40,
  },
});
