import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View,StyleSheet,StatusBar,ImageBackground,ScrollView } from 'react-native';
import Feather from "react-native-vector-icons/Feather" ;
import TalentPage from './TalentPage';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import request from "../utils/request";
import { CHAT_GETTEACHERS,CHAT_GetTeacherInfoById } from "../utils/pathMap";
import SvgUri from 'react-native-svg-uri';
import { maleTeacher,femaleTeacher } from "../res/fonts/iconSg";

// 数组.map方法-->map((循环项，索引)=><View><Text>。。。{循环项+。。。}</Text></View>)
/* undefinded问题 
    1.改成箭头函数 
    2.通过加.bind(this)绑定 
    3.匿名函数 onPress={()=>this.xxxXxx()}
    4.构造函数constructor中绑定
*/
const Tab = createBottomTabNavigator()

export default class MyCourse extends Component {
    state = {
        teacher:[],
    }

    componentDidMount() {
        this.getAllTeacher();
        console.log(this.state.teacher);
    }

    //请求所有老师数据
    getAllTeacher=async()=>{
        const T_Info = await request.get(CHAT_GETTEACHERS);
        console.log(T_Info);
        this.setState({ teacher:T_Info });
    }
    //通过Id查找老师信息
    getTeacherInfo=async(Id)=>{
        const res = await request.get(CHAT_GetTeacherInfoById+Id)
        console.log(res);
    }
    render() {
        const {teacher} = this.state
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" hidden={true} />
                <ScrollableTabView
                    style={{}}
                    initialPage={0}
                    // renderTabBar={() => <DefaultTabBar />}
                    renderTabBar={() =>  <ScrollableTabBar
                            activeTextColor="#111"
                            inactiveTextColor='rgba(0,0,0,0.7)'
                            backgroundColor="#F8F8FF"
                            tabStyle={{}}
                        />}
                    tabBarUnderlineStyle={{backgroundColor:"#FF4500",width:20,marginLeft:37}}
                    tabBarTextStyle={{fontSize:12}}
                >
                    <View tabLabel='名师推荐' >
                        <ScrollView>
                        <ImageBackground
                            source={require("../pic/recommend.jpg")}
                            style={{height:150}}
                        />
                        <View style={styles.content}>
                            <View>
                                {teacher.map((v,i)=>
                                    <View key={i} style={{flexDirection:"row",width:300,alignSelf:"center",marginTop:20,marginLeft:-10,justifyContent:"space-around"}}>
                                        <TouchableOpacity 
                                            onPress={()=>this.props.navigation.navigate("TeacherInfo",{
                                                userId:v.u_id,
                                                username:v.u_realname
                                            })}
                                            style={{flexDirection:"row",height:60}}>
                                        <View>
                                            <SvgUri svgXmlData={maleTeacher} height="55" width="55" />
                                        </View>
                                        <View style={{width:30}}></View>
                                        <View>
                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{fontSize:14,fontWeight:"bold"}}>{v.u_realname}</Text>
                                                <Text style={{fontSize:10,color:"#888"}}>·{v.t_subject}</Text>
                                            </View>
                                            
                                            <View>
                                                <Text style={{fontSize:10,color:"#888"}}>{v.t_intro}</Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* <TouchableHighlight style={styles.block1}>
                            <View>
                                <Text style={styles.text}>我的课程</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableOpacity style={styles.block2}>
                            <View>
                                <Text style={styles.text}>我的任务</Text>
                            </View>
                        </TouchableOpacity> */}
                        </ScrollView>
                    </View>
                    <View tabLabel='我的消息'>

                    </View>
                </ScrollableTabView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    TopView:{
        flex:1,
        flexDirection:'row',
        backgroundColor:"#fff",
        justifyContent:'space-around',
        
    },
    block1:{
        width:120,
        height:50,
        backgroundColor:"rgba(245,0,0,0.7)",
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    },
    block2:{
        width:120,
        height:50,
        backgroundColor:"rgba(244,164,96,0.7)",
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    },
    text:{
        color:"white",
        fontSize:13,
    },
    content:{
        backgroundColor:"#FFF",
        height:400,
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        marginTop:-10,

    }
})