import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Transaction from './screensFolder/transaction';
import Search from './screensFolder/search';

export default class App extends Component {
  render()
  {
    return(<AppContainer/>)
  }
}
const tabNav=createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search},
})
const AppContainer=createAppContainer(tabNav)