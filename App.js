import React, { Component } from 'react'
import { 
  Text, 
  View,
  StyleSheet,
  Dimensions, 
  AppRegistry 
} from 'react-native'
import Nav from "./src/Pages/nav";
import HomeStacknav from "./src/Pages/HomeStacknav";
import RootStore from "./src/mobx/index";
import UserStore from "./src/mobx/userStore";
import { Provider } from "mobx-react";
import JMessage from "./src/utils/JMessage";

export default class App extends Component {

  componentDidMount() {
    //极光初始化
    JMessage.init();
  }

  render() {
    return (
      <Provider RootStore={RootStore} UserStore={UserStore}>
      {/* <Nav/> */}
        <HomeStacknav/>
      </Provider>
    )
  }
}
