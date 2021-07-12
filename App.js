import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Transaction from "./screensFolder/transaction";
import Search from "./screensFolder/search";
import { Image } from "react-native";

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
const tabNav = createBottomTabNavigator({
  Transaction: {
    screen: Transaction,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 30, height: 30 }}
          source={require("./assets/book.png")}
        />
      ),
    },
  },
  Search: {
    screen: Search,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 30, height: 30 }}
          source={require("./assets/searchingbook.png")}
        />
      ),
    },
  },
});
const AppContainer = createAppContainer(tabNav);
