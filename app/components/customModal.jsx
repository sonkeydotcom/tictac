import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CustomModal = ({
  visible,
  winner,
  onClose,
  restartGame,
  status,
  multiplayer,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <MaterialCommunityIcons
            name={
              winner === "X"
                ? "trophy"
                : multiplayer === true
                ? "trophy"
                : status === "draw"
                ? "equal"
                : "emoticon-sad-outline"
            }
            size={100}
            color="#333"
          />

          <Text style={styles.modalText}>
            {winner === "X" && "Player 1 Wins!"}
            {winner === "O" && (multiplayer ? "Player 2 Wins!" : "AI Wins!")}
            {status === "draw" && "It's a Draw!"}
          </Text>

          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#D1AF72",
    borderRadius: 12,
    flexDirection: "column",
    borderWidth: 3,
    borderColor: "#7D653F",
    alignItems: "center",
    elevation: 5,
    width: "80%",
  },
  divider: {
    borderTopWidth: 1,
    width: "100%",
    marginVertical: 10,
    borderTopColor: "#333", // Adjust color as needed
  },
  congratsText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10,
  },

  modalText: {
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 22,
    color: "#333",
  },
  button: {
    borderTopColor: "#333",
    borderTopWidth: 1,
    padding: 12,
    elevation: 2,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    color: "#333",
  },
});

export default CustomModal;
