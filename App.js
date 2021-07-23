import React, { Component } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Transaction from "./screensFolder/transaction";
import Search from "./screensFolder/search";
import { Image } from "react-native";
import Login from './screensFolder/login'
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
const switchNav=createSwitchNavigator({
  Login:{screen:Login},
  Home:{screen:tabNav}
})
const AppContainer = createAppContainer(switchNav);
