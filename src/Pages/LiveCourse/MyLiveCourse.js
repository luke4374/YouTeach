import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { Text, View, ImageBackground, StyleSheet, Image } from 'react-native'
import TopNav from "../../components/TopNav";
import { Find_Signing, Find_Class } from "../../utils/pathMap";
import { maleTeacher } from "../../res/fonts/iconSg";
import request from "../../utils/request";
import date from "../../utils/date";
import SvgUri from 'react-native-svg-uri';
import { inject, observer } from 'mobx-react';
import Toast from '../../utils/Toast';

@inject("UserStore")
@observer
export default class MyLiveCourse extends Component {
    state={
        userId:this.props.UserStore.user.u_id,
        userType:this.props.UserStore.user.u_usertype,
        Course:[],
        myClass:[],
        isTeacher: this.props.UserStore.user.u_usertype == '1'
    }

    componentDidMount() {
        console.log("userType:",this.state.userType);
        this.getSignUpinfo();
        
    }
    
    getSignUpinfo=async()=>{
        const {userId,Course} = this.state;
        const res = await request.get(Find_Signing+userId);
        const myClass = await request.get(Find_Class+userId);
        // console.log(res);
        this.setState({
            Course: res,
            myClass:myClass
        });
    }
    
    gotoLive=(v)=>{
        const {userType,Course} = this.state;
        if(v.l_channel == "" || v.l_channel == null || v.l_channel == undefined){
            console.log(v.l_channel); 
            Toast.message("还未开课~",1000,"center")
            return;
        }else if(v.l_channel == "-1"&&userType != '1'){
            Toast.message("直播间已关闭!",1000,"center")
            return;
        }

        if (userType == '1') {
            console.log("My Lid:",v.l_id);
            this.props.navigation.navigate("LiveClass",{ cid : v.l_id })
        }else if(userType != '1' && v.l_channel != "" || v.l_channel != null){
            console.log(v.l_channel); 
            this.props.navigation.navigate("LiveVideo",{ type : "join", channel: v.l_channel,Utype:userType })
        }
    }
    renderStu=()=>{
        const {Course} = this.state;
        return Course.map((v,i)=>
            <View style={{position:"relative"}}>
                <View style={styles.Course}>
                    <Image 
                        source={{uri:v.l_pic}} 
                        style={styles.pic}
                        />
                    <View style={{flex:1,marginLeft:20,marginTop:10}}>
                        <Text style={{fontSize:16}}>{v.l_title}</Text>
                        <Text style={{color:"#666"}}>开课时间:</Text>
                        <Text style={{fontSize:14,color:"#666"}}>{date(v.l_time).format("yyyy-MM-DD HH:mm")}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.gotoLive.bind(this,v)}>
                    <Text style={{color:"#FFF",fontWeight:"bold"}}>进入教室</Text>
                </TouchableOpacity>
                <View style={{borderBottomWidth:1,borderColor:"#888",marginBottom:6,marginTop:6}}/>
            </View>
        )
    }
    renderTea=()=>{
        const {myClass} = this.state;
        console.log("进入教师页面",myClass);
        return myClass.map((v,i)=>
            <View style={{position:"relative"}}>
                <View style={styles.Course}>
                    <Image 
                        source={{uri:v.l_pic}} 
                        style={styles.pic}
                        />
                    <View style={{flex:1,marginLeft:20,marginTop:10}}>
                        <Text style={{fontSize:14}}>{v.l_title}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.gotoLive.bind(this,v)}>
                    <Text style={{color:"#FFF",fontWeight:"bold"}}>进入课堂</Text>
                </TouchableOpacity>
                <View style={{borderBottomWidth:1,borderColor:"#888",marginBottom:6,marginTop:6}}/>
            </View>
        )
    }

    render() {
        const {Course,isTeacher} = this.state
        return (
            <View style={styles.container}>
                <TopNav title="我的直播课程"/>
                {isTeacher?this.renderTea():this.renderStu()}
                {/* {Course.map((v,i)=>
                    <View style={{position:"relative"}}>
                        <View style={styles.Course}>
                            <Image 
                                source={{uri:v.l_pic}} 
                                style={styles.pic}
                                />
                            <View style={{flex:1,marginLeft:20,marginTop:10}}>
                                <Text style={{fontSize:14}}>{v.l_title}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={this.gotoLive.bind(this,v)}>
                            <Text style={{color:"#FFF",fontWeight:"bold"}}>进入教室</Text>
                        </TouchableOpacity>
                        <View style={{borderBottomWidth:1,borderColor:"#888",marginBottom:6,marginTop:6}}/>
                    </View>
                )} */}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFF",
    },
    Course:{
        width:"93%",
        height:110,
        flexDirection:"row",
    },
    pic:{
        height:100,
        width:150,
        borderRadius:10,
        flex:1,
        marginTop:5
    },
    button:{
        position:"absolute",
        bottom:10,
        right:0,
        width:100,
        height:40,
        borderRadius:20,
        backgroundColor:"#FFA500",
        alignItems:"center",
        justifyContent:"center"
    }
})