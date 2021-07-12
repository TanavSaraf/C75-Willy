import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
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
    this.setState({
      scannedDataBook: this.state.buttonState === "BookID" ? data : "",
      scannedDataStudent: this.state.buttonState === "StudentID" ? data : "",
      scanned: true,
      buttonState: "normal",
    });
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
  InputContainer:{flexDirection:'row'},
});
