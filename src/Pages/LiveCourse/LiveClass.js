import { inject, observer } from 'mobx-react';
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import AgoraRtcEngine from 'react-native-agora';
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { Add_Channel } from "../../utils/pathMap";
import request from "../../utils/request";
import Ionicons from "react-native-vector-icons/Ionicons" ;



@inject("UserStore")
@observer
export default class LiveClass extends Component {

    state={
        // AppId:"123",
        // ChannelName:"test",
        joinChannel:"",
        setJoinChannel:"",
        cid:this.props.route.params.cid
    }
    
    componentDidMount() {
        console.log("----------------------------");
        console.log("直播课程ID：",this.props.route.params);
    }
    updateChannel=async()=>{
        const {setJoinChannel,cid} = this.state;
        const res = await request.get(Add_Channel+cid+"/"+setJoinChannel);
        console.log(res);
    }

    createLive=()=>{
        const {setJoinChannel} = this.state;
        this.setState({ setJoinChannel: uuid() });
        console.log(setJoinChannel);
        this.updateChannel();
        this.props.navigation.navigate("LiveVideo",{ type : "create", channel: setJoinChannel,Utype:this.props.UserStore.user.u_usertype, cid:this.state.cid})
    }

    joinLive=()=>{
        this.props.navigation.navigate("LiveVideo",{ type : "join", channel: this.state.joinChannel })
    }
    setJoinChannel=(joinChannel)=>{
        this.setState({ joinChannel });
        console.log(joinChannel)
    }
    render() {
        const {joinChannel,setJoinChannel} = this.state
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.goback}>
                    <Ionicons name='md-return-up-back' size={30} onPress={()=>this.props.navigation.goBack()}/>
                </TouchableOpacity>
                <Text style={styles.title}>直播间设置</Text>
                <View style={styles.createContainer}>
                    <TouchableOpacity style={styles.button} onPress={this.createLive}>
                    <Text style={styles.buttonText}>建立</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.joinContainer}>
                    <TextInput
                        value={joinChannel}
                        onChangeText={this.setJoinChannel}
                        placeholder="请输入直播间ID"
                        style={styles.joinChannelInput}
                        />
                    <TouchableOpacity
                        onPress={this.joinLive}
                        disabled={joinChannel === ''}
                        style={[
                            styles.button,
                            { backgroundColor: joinChannel === '' ? '#555555' : '#78b0ff' },
                        ]}>
                    <Text style={styles.buttonText}>加入</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    // container:{
    //     justifyContent:"center",
    //     marginTop:0,
    //     padding:20,
    //     flex:1,
    //     backgroundColor:"#FFF"
    // },
    // formLabel:{
    //     paddingBottom:10,
    //     paddingTop:10,
    //     color:"#0093E9"
    // },
    // buttonContainer:{
    //     alignItems:'center',
    //     paddingTop:20,
    // },
    // SubmitButton:{
    //     paddingHorizontal:60,
    //     paddingVertical:10,
    //     backgroundColor:"#0093E9",
    //     borderRadius:25
    // },
    // formInput:{
    //     height:40,
    //     backgroundColor:"#F5F5F5",
    //     color:"#0093E9",
    //     borderRadius:4,
    //     paddingLeft:20
    // }
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position:"relative"
      },
      goback:{
        position:"absolute",
        top:10,
        left:10
      },
      title: {
        fontSize: 30,
        marginBottom: 50,
        color: '#333',
      },
      createContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      joinContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingTop: 50,
        borderTopWidth: 1,
        borderColor: '#22222255',
      },
      joinChannelInput: {
        backgroundColor: '#cccccc77',
        width: '100%',
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 17,
        textAlign: 'center',
      },
      button: {
        width: '100%',
        marginTop: 15,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#78b0ff',
      },
      buttonText: {
        color: '#fff',
        fontSize: 20,
      },

})