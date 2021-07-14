import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import firebase from "firebase";
export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      cameraStatus: null,
      scanned: false,
      scannedDataStudent: "",
      scannedDataBook: "",
      buttonState: "normal",
    };
  }
  askPermission = async (ID) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      cameraStatus: status === "granted",
      buttonState: ID,
      scanned: false,
    });
  };
  handleBarcodeScanner = async ({ type, data }) => {
    if (this.state.buttonState === "BookID") {
      this.setState({
        scannedDataBook: data,

        scanned: true,
        buttonState: "normal",
      });
    } else if (this.state.buttonState === "StudentID") {
      this.setState({
        scannedDataStudent: data,

        scanned: true,
        buttonState: "normal",
      });
    }
  };
  handleTransaction = async () => {
    db.collection("books")
      .doc(this.state.scannedDataBook)
      .get()
      .then((doc) => {
        console.log(doc.data());
        var book = doc.data();
        if (book.availability === true) {
          this.initiateBookIssue();
          console.log("bookIssued");
        } else {
          this.initiateBookReturn();
          console.log("bookReturned");
        }
      });
  };

  initiateBookIssue = async () => {
    db.collection("transaction").add({
      studentId: this.state.scannedDataStudent,
      bookId: this.state.scannedDataBook,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "issue",
    });
    db.collection("books").doc(this.state.scannedDataBook).update({
      availbility: false,
    });
    db.collection("student")
      .doc(this.state.scannedDataStudent)
      .update({
        numberOfBooks: firebase.firestore.FieldValue.increment(1),
      });
    Alert.alert("bookIsIssued");
    this.setState({ scannedDataStudent: "", scannedDataBook: "" });
  };
  render() {
    if (this.state.buttonState !== "normal" && this.state.cameraStatus) {
      return (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={
            this.state.scanned === true ? undefined : this.handleBarcodeScanner
          }
        />
      );
    } else if (this.state.buttonState === "normal") {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Transaction Screen</Text>

          <View style={styles.InputContainer}>
            <TextInput
              placeholder="Book ID"
              value={this.state.scannedDataBook}
              style={styles.textInput}
            />
            <TouchableOpacity
              style={styles.scannerButton}
              onPress={() => {
                this.askPermission("BookID");
              }}
            >
              <Text>SCAN </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              placeholder="STUDENT ID"
              value={this.state.scannedDataStudent}
              style={styles.textInput}
            />
            <TouchableOpacity
              style={styles.scannerButton}
              onPress={() => {
                this.askPermission("StudentID");
              }}
            >
              <Text>SCAN </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.handleTransaction();
            }}
            style={[styles.scannerButton, { backgroundColor: "red" }]}
          >
            <Text>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "blue", fontSize: 20 },
  scannerButton: {
    width: 90,
    height: 30,
    borderRadius: 10,
    backgroundColor: "grey",
    margin: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: 90,
    height: 30,
    borderRadius: 10,
    borderBottomWidth: 2,
    margin: 50,
    textAlign: "center",
  },
  InputContainer: { flexDirection: "row" },
});
