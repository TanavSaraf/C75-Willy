import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      cameraStatus: null,
      scanned: false,
      scannedData: "",
      buttonState: "normal",
    };
  }
  askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      cameraStatus: status === "granted",
      buttonState: "clicked",
      scanned: false,
    });
  };
  handleBarcodeScanner = async ({ type, data }) => {
    this.setState({ scannedData: data, scanned: true, buttonState: "normal" });
  };
  render() {
    if (this.state.buttonState === "clicked" && this.state.cameraStatus) {
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
          <Text style={styles.text}>{this.state.cameraStatus?this.state.scannedData:'Allow To Use The Camera'}</Text>
          <TouchableOpacity
            style={styles.scannerButton}
            onPress={() => {
              this.askPermission();
            }}
          >
            <Text>SCAN </Text>
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
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "grey",
    margin: 50,
    justifyContent: "center",
  },
});
