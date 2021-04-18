import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View,StyleSheet,StatusBar,ImageBackground,ScrollView,FlatList } from 'react-native';
import Feather from "react-native-vector-icons/Feather" ;
import JMessage from '../utils/JMessage';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import request from "../utils/request";
import { CHAT_GETTEACHERS,CHAT_GetTeacherInfoById,FIND_CHAT_USERS } from "../utils/pathMap";
import date from "../utils/date";
import SvgUri from 'react-native-svg-uri';
import { maleTeacher,femaleTeacher,BoyIcon,GirlIcon } from "../res/fonts/iconSg";
import { NavigationContext } from "@react-navigation/native";
import { inject, observer } from 'mobx-react';
import Toast from '../utils/Toast';

// 数组.map方法-->map((循环项，索引)=><View><Text>。。。{循环项+。。。}</Text></View>)
/* undefinded问题 
    1.改成箭头函数 
    2.通过加.bind(this)绑定 
    3.匿名函数 onPress={()=>this.xxxXxx()}
    4.构造函数constructor中绑定
*/
const Tab = createBottomTabNavigator()
@inject("RootStore")
@observer
export default class MyCourse extends Component {
    static contextType = NavigationContext;
    state = {
        teacher:[],
        userlist:[],
        refreshing:false
    }

    componentDidMount() {
        this.getAllTeacher();
        if(this.props.RootStore.loginstat){
            this.getConversations();
        }
        console.log("---------------------------------");
        console.log(this.state.userlist);
        console.log("---------------------------------");

    }

    getConversations=async()=>{
        this.setState({ refreshing:true  });
        const res = await JMessage.getConversations();
        // console.log(res);
        if(res.length){
            const idArr = res.map(v=>v.target.username);
            // console.log(idArr);
            const users = await request.post(FIND_CHAT_USERS,idArr);
            // console.log(users);

            this.setState({ userlist: res.map((v,i)=>({...v,user:users.data[i]})) });
        }
        this.setState({ refreshing:false  });
    }

    //请求所有老师数据
    getAllTeacher=async()=>{
        const T_Info = await request.get(CHAT_GETTEACHERS);
        // console.log(T_Info);
        this.setState({ teacher:T_Info });
    }
    //通过Id查找老师信息
    getTeacherInfo=async(Id)=>{
        const res = await request.get(CHAT_GetTeacherInfoById+Id)
        // console.log(res);
    }
    //渲染我的消息页
    renderMessage=({item})=>{
        // {userlist.map((v,i) => {
            let icon = null;
            if(item.user.u_gender === "男"){
                icon = <SvgUri svgXmlData={BoyIcon} width="50" height="50"/>
            }else{
                icon = <SvgUri svgXmlData={GirlIcon} width="50" height="50"/>
            }
            console.log("================================");
            console.log(item.latestMessage);
            if(item.latestMessage === undefined) return;
            return (
            <TouchableOpacity  style={styles.textblock} onPress={()=>this.context.navigate("Chat",item.user)}> 
                <View style={{justifyContent:"center"}}>
                    {icon}
                </View>
                <View style={{justifyContent:"space-evenly",paddingLeft:15}}> 
                    <Text style={{color:"#666"}}>{item.user.u_realname}</Text>
                    <Text style={{color:"#666"}}>{item.latestMessage.text}</Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"space-evenly"}}>
                    <Text style={{color:"#666"}}>{date(item.latestMessage.createTime).fromNow()}</Text>
                    
                    {item.unreadCount?<View style={styles.reddot}><Text style={{color:"#FFF"}}>{item.unreadCount}</Text></View>:<View style={{height:20}}></View>}
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const {teacher,userlist,refreshing} = this.state
        console.log(userlist);
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

                        </ScrollView>
                    </View>
                    <View tabLabel='我的消息' style={styles.message}>
                        {/* {userlist.length != 0?this.renderMessage():console.log("空的")} */}
                        {this.props.RootStore.loginstat?
                            <FlatList
                                data={userlist}
                                renderItem={this.renderMessage}
                                refreshing={refreshing}
                                onRefresh={()=>this.getConversations()}
                                // onEndReached={()=>this.getCourses(2)}
                            />:
                            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                    <Text style={{color:"#666"}}>还没有登陆哟~</Text>
                            </View>
                        }

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

    },
    message:{
        flex:1,
        backgroundColor:"#FFF",
        // padding:10
    },
    textblock:{
        flexDirection:"row",
        height:70,
        borderBottomWidth:1,
        borderBottomColor:"#ccc",
        padding:10
    },
    reddot:{
        width:20,
        height:20,
        borderRadius:10,
        backgroundColor:"red",
        justifyContent:"center",
        alignItems:"center"
    }
})