import React, { Component,useState } from 'react'
import { Text, View,StyleSheet,Dimensions } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigator } from "react-navigation";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import SplashScreen from 'react-native-splash-screen';
import Feather from "react-native-vector-icons/Feather" ;
import { Button, Overlay } from 'react-native-elements';
import Login from "./account/login/Login";
import CustomModal from "../utils/CustomModal";
import TestScreen from "./HomeStacknav";
import MinePage from './MinePage';
import TalentPage from './TalentPage';
import MyCourse from './MyCourse';
import Main from './Main';
import axios from "axios";
import RootStore from "../mobx";
import { inject,observer } from "mobx-react";


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
@inject("UserStore","RootStore")
@observer
export default class Nav extends Component {

  async componentDidMount() {
    
  }

    render() {
      const { navigate } = this.props.navigation;
        return (                   
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === '在线课程') {
                iconName = focused? 'airplay' : 'airplay';
              }else if(route.name === '学习'){
                iconName = focused? 'book-open' : 'book';
              }else if(route.name === '发现'){
                iconName = focused? 'compass' : 'compass';
              }else if(route.name === '我的主页'){
                iconName = focused ? 'home':'home';
              }
              // You can return any component that you like here!
              return <Feather name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'red',
            inactiveTintColor: 'gray',
          }}>
            
            <Tab.Screen name="在线课程" component={Main}/>
            <Tab.Screen name="学习" component={MyCourse}/>
            <Tab.Screen name="发现" component={TalentPage}/>
            <Tab.Screen name="我的主页" component={MinePage}/>
          </Tab.Navigator>
        )

    }
}
