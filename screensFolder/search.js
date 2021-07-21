import React from "react";
import { View, Text, StyleSheet, FlatList,StatusBar } from "react-native";
import { SearchBar } from "react-native-elements";
import db from "../config";
export default class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      allTransaction: [],
      lastVisibleTransaction: null,
      searched: "b",
    };
  }
  fetchMoreData = async () => {
    var text = this.state.searched.toLocaleLowerCase();
    if (text[0] === "b") {
      db.collection("transaction")
        .where("bookId", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .then((responce) => {
          responce.docs.map((doc) => {
            //the spread operator is used ie. (...)
            this.setState({
              allTransaction: [...this.state.allTransaction, doc.data()],
              lastVisibleTransaction: doc,
            });
          });
        });
    }else   if (text[0] === "s") {
      db.collection("transaction")
        .where("studentId", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .then((responce) => {
          responce.docs.map((doc) => {
            //the spread operator is used ie. (...)
            this.setState({
              allTransaction: [...this.state.allTransaction, doc.data()],
              lastVisibleTransaction: doc,
            });
          });
        });
    }
  };
  componentDidMount() {
    db.collection("transaction")
      .limit(10)
      .get()
      .then((responce) => {
        responce.docs.map((doc) => {
          //the spread operator is used ie. (...)
          this.setState({
            allTransaction: [...this.state.allTransaction, doc.data()],
            lastVisibleTransaction: doc,
          });
        });
      });
  }
  render() {
    if (this.state.allTransaction.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            The Transaction is Empty ,Try Restarting{" "}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{marginTop:StatusBar.currentHeight}}>
          <SearchBar 
          
          value={this.state.searched}
          onChangeText={(text)=>{
            this.setState({searched:text})

          }}/>
          <FlatList
        onEndReached={this.fetchMoreData}
        onEndReachedThreshold={0.9}
        data={this.state.allTransaction}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 2, padding: 5, marginTop: 20 }}>
            <Text>bookId:{item.bookId}</Text>
            <Text>StudentId:{item.studentId}</Text>
            <Text>Type:{item.transactionType}</Text>
          </View>
        )}
      /></View>
      );
    }
    console.log(this.state.allTransaction);
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "blue", fontSize: 20 },
});
