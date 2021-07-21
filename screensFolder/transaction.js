import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
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
    var transactionType = await this.checkBookEligibility();
    console.log(transactionType);
    if (transactionType === false) {
      ToastAndroid.show("THE BOOK IS NOT FROM THIS LIBRARY", ToastAndroid.LONG);
      this.setState({ scannedDataStudent: "", scannedDataBook: "" });
    } else if (transactionType == "issue") {
      var isStudentEligible = await this.checkStudentEligibilityForIssue();
      if (isStudentEligible) {
        this.initiateBookIssue();
        ToastAndroid.show("book Issued", ToastAndroid.LONG);
      }
    } else {
      var isStudentEligible = await this.checkStudentEligibilityForReturn();
      if (isStudentEligible) {
        this.initiateBookReturn();
        ToastAndroid.show("book Returned", ToastAndroid.LONG);
      }
    }
  };
  checkStudentEligibilityForReturn = async () => {
    var transactionRef = await db
      .collection("transaction")
      .where("bookId", "==", this.state.scannedDataBook)
      .limit(1)
      .get();
    var isStudentEligible = "";
    transactionRef.docs.map((doc) => {
      var lastTransaction = doc.data();
      if (lastTransaction.studentId === this.state.scannedDataStudent) {
        isStudentEligible = true;
      } else {
        isStudentEligible = false;
        this.setState({ scannedDataBook: "", scannedDataStudent: "" });
        Alert.alert("This Student did not issue this book");
      }
    });
    return isStudentEligible;
  };
  checkStudentEligibilityForIssue = async () => {
    var StudentRef = await db
      .collection("student")
      .where("studentId", "==", this.state.scannedDataStudent)
      .get();
    var isStudentEligible = "";
    if (StudentRef.docs.length === 0) {
      isStudentEligible = false;
      this.setState({ scannedDataBook: "", scannedDataStudent: "" });
      Alert.alert("Student ID is not present");
    } else {
      StudentRef.docs.map((doc) => {
        var student = doc.data();
        if (student.numberOfBooks < 2) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          this.setState({ scannedDataBook: "", scannedDataStudent: "" });
          Alert.alert("The Student has issued a book before");
        }
      });
    }
    return isStudentEligible;
  };
  checkBookEligibility = async () => {
    var bookRef = await db
      .collection("books")
      .where("bookId", "==", this.state.scannedDataBook)
      .get();
    var transactionType = "";
    if (bookRef.docs.length == 0) {
      transactionType = false;
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();
        if (book.availability === true) {
          transactionType = "issue";
        } else {
          transactionType = "return";
        }
      });
    }
    return transactionType;
  };
  initiateBookIssue = async () => {
    db.collection("transaction").add({
      studentId: this.state.scannedDataStudent,
      bookId: this.state.scannedDataBook,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "issue",
    });
    db.collection("books").doc(this.state.scannedDataBook).update({
      availability: false,
    });
    db.collection("student")
      .doc(this.state.scannedDataStudent)
      .update({
        numberOfBooks: firebase.firestore.FieldValue.increment(1),
      });
    ToastAndroid.show("bookIsIssued", ToastAndroid.LONG);
    this.setState({ scannedDataStudent: "", scannedDataBook: "" });
  };
  initiateBookReturn = async () => {
    db.collection("transaction").add({
      studentId: this.state.scannedDataStudent,
      bookId: this.state.scannedDataBook,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "return",
    });
    db.collection("books").doc(this.state.scannedDataBook).update({
      availability: true,
    });
    db.collection("student")
      .doc(this.state.scannedDataStudent)
      .update({
        numberOfBooks: firebase.firestore.FieldValue.increment(-1),
      });
    ToastAndroid.show("bookIsReturned", ToastAndroid.LONG);
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
        <KeyboardAvoidingView
          behavior="height"
          enabled
          style={styles.container}
        >
          <Text style={styles.text}>Transaction Screen</Text>

          <View style={styles.InputContainer}>
            <TextInput
              placeholder="Book ID"
              value={this.state.scannedDataBook}
              style={styles.textInput}
              onChangeText={(vals) => {
                this.setState({ scannedDataBook: vals });
              }}
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
              onChangeText={(vals) => {
                this.setState({ scannedDataStudent: vals });
              }}
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
        </KeyboardAvoidingView>
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
