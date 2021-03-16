import React, {useState,Component} from 'react';
import { 
  Text, 
  View,
  StyleSheet,
  Dimensions, 
  ScrollView, 
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground
} from 'react-native';
import {
  CodeField,
  Cursor
} from 'react-native-confirmation-code-field';
import TopNavHome from "../components/TopNav";
import { Overlay } from "teaset";

import request from "../utils/request";
import { SUBJECT_CHINESE,SUBJECT_ENGLISH,SUBJECT_MATH,ABILITY_INFO } from "../utils/pathMap";
//视频播放组件
import Slider from 'react-native-slider';
import Video from 'react-native-video';
//Jmessage
import JMessage from "../utils/JMessage";
import { inject, observer } from "mobx-react";
 
let screenWidth  = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
console.log(screenWidth+"   "+screenHeight+"带有小数");

@inject("RootStore","UserStore")
@observer    
export default class Demo extends Component {

    state = {
      // status :this.props.RootStore.status,
      statement:false,
      visible:false,
      setVisible:false
    }
    showOverlay=()=> {
      let overlayView = (
        <Overlay.View
          style={styles.overlayContainer}
          modal={true}
          overlayOpacity={0}
          ref={v => this.overlayView = v}
          >
          <View style={styles.overlay}>

          </View>
        </Overlay.View>
      );
        Overlay.show(overlayView);

    }
  render(){
    const {statement,visible} = this.state
    return(
      <View style={styles.container}>
                <TopNavHome title={"答题结果"} page={"Nav"} />
                {/* 背景图片 */}
                <ImageBackground 
                    style={{height:"60%",width:"100%"}}
                    imageStyle={{height:"100%", borderBottomLeftRadius:15,borderBottomRightRadius:15}}
                    source={require("../pic/beach.png")}
                >
                  </ImageBackground>
                <View>
                  <TouchableOpacity onPress={()=>this.setState({ setVisible:!visible },console.log(this.state.setVisible))}>
                      <Text>Overlay</Text>
                  </TouchableOpacity>
                  {this.state.setVisible?this.showOverlay():null}
                </View>
                  
      </View>
    )
  }
}
var styles = StyleSheet.create({
  container:{
    flex:1
  },
  renderAbility:{
      width: 340,
      height: 240
  },
  playBtn:{
      width: 50,
      height: 50,
      backgroundColor:'rgba(211,211,211,0.6)',
      borderRadius: 50,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -25,
      marginTop:-25,
      zIndex:999,
      justifyContent:"center",
      alignItems:"center"
  },
  sliderBox:{
      flex:0,
      flexDirection:'row',
      alignItems:'center',
      color:"#eee",
      opacity:1
  },
  backgroundVideo: {
    // width:screenWidth,
    position: 'absolute',
    top: 100,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlayContainer:{
    alignItems: 'center', 
    justifyContent: 'center',
  },
  overlay:{
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    width:270,
    height:450
  }
});