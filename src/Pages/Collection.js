import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { inject, observer } from "mobx-react";
import Toast from '../utils/Toast';
import AntDesign from "react-native-vector-icons/AntDesign" ;
import request from "../utils/request";
import { DELETE_COLLECTION, FIND_COLL_BYUID } from "../utils/pathMap";
import TopNavHome from "../components/TopNav";
import { StyleSheet } from 'react-native';

@inject("RootStore","UserStore")
@observer    
export default class Collection extends Component {
    state = {
        userId:this.props.UserStore.user.u_id,
        collection:[]
      }
      componentDidMount() {
        this.getCollection();
      }
      getCollection=async()=>{
        const res = await request.get(FIND_COLL_BYUID+this.state.userId);
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
                <ScrollView style={{height:510}}>
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
              </ScrollView>
            </View>
        </View>
      )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
      },
})
