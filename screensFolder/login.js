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
import { Header } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      passcode: "",
    };
  }
  login = async () => {
    if (this.state.email && this.state.passcode) {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.passcode);
          if(response)
          {
              this.props.navigation.navigate('Transaction')
          }
      } catch (error) {
        Alert.alert(error.message);
      }
    } else {
      ToastAndroid.show("Enter the Credentials", ToastAndroid.SHORT);
    }
  };
  render() {
    return (
      <View>
        <Header
          centerComponent={{
            text: "WILLY",
            style: { color: "white", fontSize: 20 },
          }}
          backgroundColor="black"
        />

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(data) => {
            this.setState({ email: data });
          }}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Passcode"
          onChangeText={(data) => {
            this.setState({ passcode: data });
          }}
          value={this.state.email}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={() => {
            this.login();
          }}
        >
          <Text style={styles.text}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "blue", fontSize: 20 },
  scannerButton: {
    width: 90,
    height: 30,
    backgroundColor: "red",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: 90,
    height: 30,
    borderRadius: 10,
    borderBottomWidth: 2,
    margin: 6,
    textAlign: "center",
  },
  InputContainer: { flexDirection: "row" },
});
