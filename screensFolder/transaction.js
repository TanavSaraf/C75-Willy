import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Transaction extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Transaction Screen</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "blue", fontSize: 20 },
});
