import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  View,
  TouchableOpacity,
  Vibration,
} from "react-native";

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [justRestarted, setJustRestarted] = useState(false);
  const [multiplayer, setMultiplayer] = useState(true);
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
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
    const squares = [...currentSquares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    //Alert.alert("Invalid move", "It's not your turn!");
    squares[i] = xIsNext ? "X" : "O";
    handlePlay(squares);

    // Check for winner again after player's move

    // Find AI's move
    if (!multiplayer) {
      const winner = calculateWinner(squares);
      if (winner) {
        return; // If there's a winner, no need for AI to play
      }
      const bestMove = calculateBestMove(squares, "O");
      squares[bestMove] = "O";
      handlePlay(squares);
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

  const aiStarts = () => {
    const squares = [...currentSquares];
    const bestMove = calculateBestMove(squares, "O");
    squares[bestMove] = "O";
    handlePlay(squares);
  };

  const restartGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext((prevXIsNext) => !prevXIsNext); // Toggle xIsNext
    setJustRestarted(true);
  };

  const toggleMode = () => {
    setMultiplayer(!multiplayer);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true); // Toggle xIsNext
  };

  useEffect(() => {
    if (!xIsNext && justRestarted) {
      const squares = [...currentSquares];
      const bestMove = calculateBestMove(squares, "O");
      squares[bestMove] = "O";
      handlePlay(squares);
      setJustRestarted(false);
    }
  }, [xIsNext, justRestarted]);

  const renderSquare = (i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.square}
        onPress={() => handleClick(i)}
      >
        <Text style={styles.squareText}>{currentSquares[i]}</Text>
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
      Vibration.vibrate(1000);
    } else if (isBoardFull(currentSquares)) {
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
    <View style={styles.container}>
      <Text>Game mode: {multiplayer ? "Multiplayer" : "Single Player"}</Text>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={styles.row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={toggleMode}>
        <Text style={styles.buttonText}>
          {multiplayer ? "Switch to Single Player" : "Switch to Multiplayer"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={restartGame}>
        <Text style={styles.buttonText}>Restart Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  status: {
    marginBottom: 20,
    fontSize: 24,
  },
  board: {
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  squareText: {
    fontSize: 36,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Game;