import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = history.slice(0, currentMove + 1);
    setHistory([...nextHistory, nextSquares]);
    setCurrentMove(currentMove + 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
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
    const squares = [...currentSquares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    handlePlay(squares);
  };

  const renderSquare = (i) => {
    return (
      <TouchableOpacity style={styles.square} onPress={() => handleClick(i)}>
        <Text>{currentSquares[i]}</Text>
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

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.game}>
        <View style={styles.gameBoard}>
          <View style={styles.boardRow}>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </View>
          <View style={styles.boardRow}>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </View>
          <View style={styles.boardRow}>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </View>
        </View>
        <View style={styles.gameInfo}>
          <Text>{status}</Text>
          <Text>Moves:</Text>
          <View style={styles.moveList}>{moves}</View>
        </View>
      </View>
    </View>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  game: {
    flexDirection: "row",
  },
  gameBoard: {
    marginRight: 20,
  },
  boardRow: {
    flexDirection: "row",
  },
  gameInfo: {
    justifyContent: "center",
  },
  moveList: {
    marginTop: 10,
  },
  square: {
    width: 50,
    height: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
