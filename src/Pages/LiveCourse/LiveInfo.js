import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { Text, View, ImageBackground, StyleSheet } from 'react-native'
import TopNav from "../../components/TopNav";
import { CHAT_GetTeacherInfoById, ACCOUNT_FINDBYID, Live_SignUp,Find_SignByid,Check_LiveStat } from "../../utils/pathMap";
import { maleTeacher } from "../../res/fonts/iconSg";
import request from "../../utils/request";
import date from "../../utils/date";
import SvgUri from 'react-native-svg-uri';
import { inject, observer } from 'mobx-react';
import Toast from '../../utils/Toast';

@observer
@inject("UserStore","RootStore")
export default class LiveInfo extends Component {

    state={
        Course:this.props.route.params.liveCourse,
        uid:this.props.route.params.liveCourse.u_id,
        teacher:[],
        Tinfo:{},
        userid:this.props.UserStore.user.u_id,
        signStat:true,
        classStat:0
    }

    componentDidMount() {
        this.getInfo();
        this.signStat();
        // console.log(this.state.Course);
    }

    getInfo=async()=>{
        const {uid} = this.state;
        const info = await request.get(CHAT_GetTeacherInfoById+this.state.uid);
        this.setState({ Tinfo: info });

        const data = await request.get(ACCOUNT_FINDBYID+this.state.uid);
        this.setState({ teacher: data.data });
        // console.log(this.state.teacher);
    }
    //查找是否报名
    signStat=async()=>{
        const {Course,userid} = this.state
        const stat = await request.get(Find_SignByid+userid+'/'+Course.l_id);
        console.log(stat);
        if(stat != '1'){
            this.setState({signStat: false });
        }
    }

    SignUp=async()=>{
        const {Course,userid} = this.state
        console.log();
        console.log(Course.l_id);
        if(this.props.RootStore.loginstat){
            const sign = await request.get(Live_SignUp+userid+'/'+Course.l_id)
            Toast.smile("报名成功")
            this.setState({ signStat: true });
            // console.log(sign);
        }else{
            Toast.sad("未登录")
        }
    }
    classStat =async()=>{
        const res = await request.get(Check_LiveStat);
    }

    render() {
        const {Course,teacher,Tinfo,signStat} = this.state
        return (
            <View style={styles.container}>
                <TopNav title={Course.l_title}/>
                <ScrollView style={{height:100}}>
                    <ImageBackground
                        source={{uri:Course.l_pic}}
                        style={{height:200}}
                    />
                    {/* 第一栏 */}
                    <View style={{padding:10}}>
                        <Text style={{fontSize:20}}>{Course.l_title}</Text>
                        <Text style={{color:"#C0C0C0"}}>开课时间：{date(Course.l_time).format("YYYY-MM-DD HH:mm")} | 1小时</Text>
                    </View>
                    {/* 空行 */}
                    <View style={{height:10,backgroundColor:"#F3F3F3"}}></View>
                    {/* 第二栏 */}
                    <View style={{padding:10}}>
                        <Text style={{fontSize:18,marginBottom:10}}>授课教师</Text>
                        <View style={{flexDirection:"row",marginLeft:20}}>
                            <SvgUri svgXmlData={maleTeacher} width="50" height="50"/>
                            <View style={{alignSelf:"center",marginLeft:10}}>
                                <Text style={{fontSize:15}}>{teacher.u_realname}</Text>
                                <Text style={{color:"#CCC",fontSize:12}}>{Tinfo.t_subject}</Text>
                            </View>
                        </View>
                    </View>              
                    <View style={{padding:10}}>
                        <Text style={{fontSize:15,marginBottom:10}}>教师信息</Text>
                        <Text style={{marginLeft:20,marginBottom:10}}>{Tinfo.t_res}</Text>
                        <Text style={{marginLeft:20}}>{Tinfo.t_exp}</Text>
                    </View>
                    {/* 空行 */}
                    <View style={{height:10,backgroundColor:"#F3F3F3"}}></View>
                    {/* 第三栏 */}
                    <View style={{padding:13}}>
                        <Text style={{fontSize:18,marginBottom:10}}>课程信息</Text>
                        <Text>{Course.l_info}</Text>
                    </View>
                </ScrollView>
                <View style={styles.bottom}>
                    {signStat?
                        <View style={styles.SignButton}>
                            <Text style={{color:"#FFF"}}>已报名</Text>
                        </View>:
                        <TouchableOpacity style={styles.UnsignButton} onPress={this.SignUp}>
                            <Text style={{color:"#FFF"}}>立即报名</Text>
                        </TouchableOpacity>
                    }


                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        position:"relative",
        backgroundColor:"#FFF"
    },
    bottom:{
        // position:"absolute",
        bottom:0,
        right:0,
        backgroundColor:"rgba(192,192,192,0.3)",
        height:60,
        width:"100%",
        justifyContent:"center",
    },
    UnsignButton:{
        width:100,
        height:40,
        borderRadius:20,
        backgroundColor:"rgb(255,99,71)",
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        right:10
    },
    SignButton:{
        width:100,
        height:40,
        borderRadius:20,
        backgroundColor:"rgba(255,99,71,0.8)",
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        right:10
    }

})