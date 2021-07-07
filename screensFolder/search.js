import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Search extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>SEARCH</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "blue", fontSize: 20 },
});
