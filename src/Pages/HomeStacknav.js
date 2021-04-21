import React, { Component } from 'react';
import { View, Text, Button, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Main from "./Main";
import Login from "./account/login/Login";
import Register from './account/login/Register';
import UserInfo from "./account/userinfo/index";
import Video from "./VideoPage";
import nav from "./nav";
import Demo from "./Demo";
import LiveCourse from "./LiveCourse/LiveCourse";
import Test from "./TestPage";
import TeacherInfo from "./Teacher/Info";
import Chat from "./chat/chat";
import AbilityInfo from "./Ability/AbilityInfo";
import Collection from "./Collection";
import userUpdate from "./account/userUpdate";
import UpdateInfo from "./Teacher/UpdateInfo";
import LiveInfo from "./LiveCourse/LiveInfo";
import MyLiveCourse from "./LiveCourse/MyLiveCourse";
import AgoraLive from "./LiveCourse/AgoraLive";
import LiveClass from "./LiveCourse/LiveClass";
import LiveVideo from "./LiveCourse/Video";
import Bind from "./account/bind/index";

const HomeStack = createStackNavigator();
export default class HomeScreen extends Component {
 
    render() {
        // const { navigate } = this.props.navigation;
        return (
            <NavigationContainer>
                {/* initialRouteName="UserInfo" */}
            <HomeStack.Navigator headerMode="none" >
                <HomeStack.Screen  name="Nav" component={nav} />
                <HomeStack.Screen name="Login" component={Login} />
                <HomeStack.Screen name="Chat" component={Chat} />
                <HomeStack.Screen name="AbilityInfo" component={AbilityInfo} />
                <HomeStack.Screen name="TeacherInfo" component={TeacherInfo} />
                <HomeStack.Screen name="Register" component={Register}/>
                <HomeStack.Screen name="UserInfo" component={UserInfo}/>
                <HomeStack.Screen name="Video" component={Video}/>
                <HomeStack.Screen name="Test" component={Test}/>
                <HomeStack.Screen  name="Demo" component={Demo} />
                <HomeStack.Screen  name="LiveCourse" component={LiveCourse} />
                <HomeStack.Screen  name="Collection" component={Collection} />
                <HomeStack.Screen  name="userUpdate" component={userUpdate} />
                <HomeStack.Screen  name="UpdateInfo" component={UpdateInfo} />
                <HomeStack.Screen  name="LiveInfo" component={LiveInfo} />
                <HomeStack.Screen  name="MyLiveCourse" component={MyLiveCourse} />
                <HomeStack.Screen  name="AgoraLive" component={AgoraLive} />
                <HomeStack.Screen  name="LiveClass" component={LiveClass} />
                <HomeStack.Screen  name="LiveVideo" component={LiveVideo} />
                <HomeStack.Screen  name="Bind" component={Bind} />
            </HomeStack.Navigator>
            </NavigationContainer>
        )
    }
}