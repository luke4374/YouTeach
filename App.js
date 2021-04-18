import React, { Component } from 'react'
import { Text, View,} from 'react-native'
import Nav from "./src/Pages/nav";
import HomeStacknav from "./src/Pages/HomeStacknav";
import RootStore from "./src/mobx/index";
import UserStore from "./src/mobx/userStore";
import { Provider } from "mobx-react";
import JMessage from "./src/utils/JMessage";
import Agora from "./src/utils/Agora";
import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {

  componentDidMount() {
    //极光初始化
    JMessage.init();
    //声网初始化
    Agora.init();
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider RootStore={RootStore} UserStore={UserStore}>
        <HomeStacknav/>
      </Provider>
    )
  }
}
