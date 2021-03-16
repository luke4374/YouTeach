import React, { Component } from 'react'
import { Text, View,ImageBackground, StyleSheet,ScrollView,TouchableOpacity } from 'react-native'
import SvgUri from 'react-native-svg-uri';
import TopNav from "../../components/TopNav";
import { maleTeacher } from "../../res/fonts/iconSg";
import request from "../../utils/request";
import { CHAT_GetTeacherInfoById,CHAT_FINDUSER } from "../../utils/pathMap";
import LoginButton from "../../components/LoginButton";
import JMessage from '../../utils/JMessage';
import { inject,observer } from 'mobx-react';
import Toast from "../../utils/Toast";

@inject("UserStore","RootStore")
@observer
export default class Info extends Component {
    state={
        userId:this.props.route.params.userId,
        userInfo:[],
        teacherInfo:{},
        username:this.props.route.params.username
    }
    componentDidMount() {
        console.log(this.state.userId);
        this.getTeacherInfo()
    }

    getTeacherInfo=async()=>{
        const {userId} = this.state
        const res = await request.get(CHAT_GetTeacherInfoById+userId)
        this.setState({ userInfo:res  });
        console.log(res);
        //根据id查找老师
        const Detail = await request.get(CHAT_FINDUSER+userId);
        this.setState({ teacherInfo:Detail  });
    }
    // 点击聊天
    pressChat=async()=>{
        const{userId} = this.state;
        //收件人 = > 正在被浏览的用户
        const JGuserId = userId.toString();
        // 文本内容 => 用户名 + 想找你聊聊天
        const text = this.props.UserStore.user.u_realname + "想要和你聊天";
        // 额外数据 => 把当前登录用户发送
        const extras = {user:JSON.stringify(this.state.teacherInfo)}
        const res = await JMessage.sendTextMessage(JGuserId,text,extras)
        console.log(res);
    }
    goChat=()=>{
        const {teacherInfo} = this.state;
        if(!this.props.RootStore.loginstat){
            Toast.sad("请先登录",1000,"center")
            return;
        }
        this.props.navigation.navigate("Chat",teacherInfo);
    }
    render() {
        const {userInfo,username} = this.state;
        return (
            <View style={styles.container}>
                <TopNav title="教师详情"/>
                <ScrollView>
                <ImageBackground 
                    style={{height:170}}
                    imageStyle={{height:140}}
                    source={require("../../pic/blackboard.png")}
                >
                </ImageBackground>
                <View style={styles.detail}>
                    {/* 第一栏 */}
                    <View style={{flexDirection:"row"}}>
                        <View style={styles.pic}>
                            <SvgUri svgXmlData={maleTeacher} height="68" width="68" />
                        </View>
                        <View style={{height:30,width:120,marginLeft:79,marginTop:10}}>
                            <LoginButton onPress={this.goChat}>聊一下</LoginButton>
                        </View>
                    </View>
                    {/* 第二栏 */}
                    <View>
                        <Text style={{marginLeft:12,fontSize:20,fontWeight:"bold"}}>{username}</Text>
                        <Text style={{marginLeft:12,fontSize:11,marginTop:6}}>{userInfo.t_subject}</Text>
                        <Text style={{marginLeft:12,fontSize:11,marginTop:6,color:"#999"}}>{userInfo.t_intro} </Text>
                    </View>
                    {/* 分割线 */}
                    <View style={{height:6,backgroundColor:"#DCDCDC",marginTop:30,marginBottom:10}}></View>
                    {/* 介绍 */}
                    <View>
                        <Text style={{marginLeft:12,fontSize:20,fontWeight:"bold"}}>介绍</Text>
                        <Text style={styles.textTitle}>教师资质</Text>
                        <Text style={styles.textContext}>{userInfo.t_number}</Text>
                        <Text style={styles.textTitle}>教学经历</Text>
                        <Text style={styles.textContext}>{userInfo.t_exp}</Text>
                        <Text style={styles.textTitle}>教学成果</Text>
                        <Text style={styles.textContext}>{userInfo.t_res}</Text>
                        <Text style={styles.textTitle}>教学特点</Text>
                        <Text style={styles.textContext}>{userInfo.t_description}</Text>
                    </View>
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    detail:{
        marginTop:-40,
        // padding:20,
        // height:500,
        backgroundColor:"#fff",
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
    pic:{
        borderWidth:5,
        marginLeft:12,
        marginTop:-30,
        borderColor:"white",
        width:78,
        height:80,
        borderRadius:39
    },
    textTitle:{
        marginLeft:16,
        fontSize:16,
        fontWeight:"bold"
    },
    textContext:{
        marginRight:10,
        marginLeft:20,
        fontSize:13,
        marginTop:6,
        marginBottom:6,
        color:"#999"
    }
})
