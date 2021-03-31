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
import AntDesign from "react-native-vector-icons/AntDesign" ;
import request from "../utils/request";
import { DELETE_COLLECTION, FIND_COLL_BYUID } from "../utils/pathMap";
//视频播放组件
import Slider from 'react-native-slider';
import Video from 'react-native-video';
//Jmessage
import JMessage from "../utils/JMessage";
import { inject, observer } from "mobx-react";
import Toast from '../utils/Toast';
 
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
      setVisible:false,
      collection:[]
    }
    componentDidMount() {
      this.getCollection();
    }
    getCollection=async()=>{
      const res = await request.get(FIND_COLL_BYUID+"6013");
      console.log(res);
      this.setState({ collection:res  });
    }

    deleteCollection=async(fid)=>{
      const res = await request.delete(DELETE_COLLECTION+fid);
      if(res.status == 1){
        Toast.message("取消收藏",1000,"bottom");
        this.getCollection();
      }
      console.log(res);
    }

  render(){
    const {statement,collection} = this.state
    return(
      <View style={styles.container}>
        <TopNavHome title={"我的收藏"}/>
          <View>
            {collection.map((v,i)=>
            <View style={{justifyContent:"center"}}>
              <TouchableOpacity style={{flexDirection:"row",height:95,padding:6}} 
                onPress={()=>this.props.navigation.navigate('Video',{
                  c_id:v.c_id,
                  c_subject:v.c_subject
                })}>
                <View style={{width:"38%"}}>
                  <Image 
                      source={{uri:v.c_pic}} 
                      style={{width:120,height:80,borderRadius:15}}
                  />
                </View>
                <View style={{width:"63%",position:"relative",margin:6}}>
                  <Text style={{marginBottom:10}}>{v.c_name}</Text>
                  <TouchableOpacity style={{position:"absolute",right:20,top:50}}
                    onPress={this.deleteCollection.bind(this,v.f_id)}
                  >
                    <AntDesign name="delete" size={25} color="#C0C0C0"/>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View style={{width:"100%",height:1,backgroundColor:"lightgray"}}></View>
            </View>
            )}
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