import React, { useEffect, useState } from "react";
import { Modal, Text, View, ActivityIndicator, StyleSheet } from "react-native";

const Modals = () => {
  const [isSearching, setIsSearching] = useState(true);

  const [message, setMessage] = useState(
    isSearching ? "Searching for an opponent..." : "Opponent found!"
  );

  useEffect(() => {
    let timeoutId;
    if (isSearching) {
      // Set a delay of 5 seconds (or however long you want)
      timeoutId = setTimeout(() => {
        setMessage("No user found");
        setIsSearching(false);
        // Close the modal here
      }, 5000);
    } else {
      setMessage("Opponent found!");
    }

    // Clean up the timeout when the component unmounts or when isSearching changes
    return () => clearTimeout(timeoutId);
  }, [isSearching]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSearching}
      onRequestClose={() => {
        // Handle modal close (if needed)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.modalText}>{message}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginTop: 10,
    textAlign: "center",
  },
});

export default Modals;
