import React, { Component } from 'react'
import { Text, View,StyleSheet,Dimensions, AppRegistry, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigator } from "react-navigation";
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

class CustomBottomTabBar extends React.Component {
    //这里对navigation进行处理，注意这里不能直接修改props.navigation,会报错，
    //所以只需要传入一个自定义的navigation，而BottomTabBar只会用到navigation.state中routes和index,
    //所以就构造这么一个虚假的navigation就可以了
    state = {
      isHidden: false
    }
    /* 控制底部导航栏显示隐藏 */
    // componentDidMount() {
    //   DeviceEventEmitter.addListener('closeBottomTab', (val) => {
    //     this.setState({ isHidden: val })
    //   });
    //  DeviceEventEmitter.emit('closeBottomTab', false);
    // }
    // componentWillUnmount() {
    //   DeviceEventEmitter.removeListener('closeBottomTab');
    // }
  
    dealNavigation = () => {
      const { routes, index } = this.props.navigation.state;
      // 根据是否需要显示商品推荐菜单来决定state中的routes
      let finalRoutes = this.filterOperation();
      const currentRoute = routes[index];
      return {
        state: {
          index: finalRoutes.findIndex(route => currentRoute.key === route.key), //修正index
          routes: finalRoutes
        }
      };
    };
  
    filterOperation = (arr) => {
      if (this.props.screenProps.module) {
        let operation = this.props.screenProps.module.filter(item => item.menuName === '运维中心')[0].childMenu.slice(0, 4);
        let nameArr = operation.map(item => item.menuName);
        return originalRoutes.filter(route => route.name === '运维中心' || nameArr.includes(route.name))
      } else {
        return originalRoutes
      }
    }
  
    render() {
      const { navigation, ...restProps } = this.props;
      const myNavigation = this.dealNavigation();
      return <BottomTabBar {...restProps} navigation={myNavigation} style={{ display: this.state.isHidden || myNavigation.state.index === -1 ? 'none' : 'flex' }} />;
    }
  }