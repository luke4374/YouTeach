import React, { Component } from 'react'
import { 
    Text, 
    View , 
    StyleSheet,
    Button,
    Animated, 
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    ImageBackground
} from 'react-native'
import TalentPage from './TalentPage';    
import {ImageHeaderScrollView} from 'react-native-image-header-scroll-view';
import SvgUri from "react-native-svg-uri";
import { GirlIcon, UnLogin,BoyIcon,Collect,Plane,Tongxun,Settings,Talk,find } from "../res/fonts/iconSg";
import { observer,inject } from 'mobx-react';
import request from '../utils/request';
import { ACCOUNT_FINDBYID } from "../utils/pathMap";
import { Alert } from 'react-native';
import Toast from '../utils/Toast';

@inject("UserStore","RootStore")
@observer
export default class MinePage extends Component {
    state={
        userId:this.props.UserStore.user,
        // usertype:this.props.UserStore.user.u_usertype,
        isRefreshing:true,
        RfPage:true
    };
    componentDidMount() { 
        this.getUser();
    }


    //获取数据刷新
    getUser=async()=>{
        if(this.props.RootStore.loginstat == false){
            this.setState({ isRefreshing:false  });
            return;
        }
        const {userId} = this.state;
        console.log(userId.u_id);
        const user = await request.get(ACCOUNT_FINDBYID+userId.u_id);
        this.setState({ 
            usertype:user.data.u_usertype,
            Gender: user.data.u_gender,
            username: user.data.u_username,
            LoginStat:true
          });
        this.setState({ isRefreshing:false  });
        console.log(user);
    }

    //头像过滤方法
    selectIcon=()=>{
        if( this.props.UserStore.user.u_gender == "男"){
            console.log("男人");
            return <SvgUri svgXmlData={BoyIcon} width="80" height="80"/>
        }else{
            console.log("女人");
            return <SvgUri svgXmlData={GirlIcon} width="80" height="80"/>
        }
    }
    //用户筛选
    selectUserBar=()=>{
        if(this.props.UserStore.user == null){
            return;
        }
        if(this.props.UserStore.user.u_usertype == 1){
            return(
                <View style={styles.bottomBlock}>
                <TouchableOpacity >
                    <View style={{flexDirection:"row"}}>
                        <SvgUri svgXmlData={find} width="25" height="25"/>
                        <Text style={{marginTop:2,marginLeft:5,fontSize:14,color:"#555"}}>上传教师信息</Text>
                    </View>
                </TouchableOpacity>
            </View>
            )
        }else if(this.props.UserStore.user.u_usertype == 0 || this.props.UserStore.user.u_usertype == 2){
                    //学生和家长用户绑定按键
            return(
                <View style={styles.bottomBlock}>
                    <TouchableOpacity >
                        <View style={{flexDirection:"row"}}>
                            <SvgUri svgXmlData={find} width="25" height="25"/>
                            <Text style={{marginTop:2,marginLeft:5,fontSize:14,color:"#555"}}>绑定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    //判断用户类型
    renderloginIcon=()=>{
        let type = "";
        if(this.props.UserStore.user.u_usertype == 0){
            type = "学生";
        }else if(this.props.UserStore.user.u_usertype == 1){
            type = "老师";
        }else{
            type = "家长";
        }
        return(
            <View style={{alignSelf:'center'}}>
                <TouchableOpacity style={{alignSelf:"center"}}>
                    {this.selectIcon()}
                </TouchableOpacity>
                <Text style={{alignSelf:"center",fontSize:15,color:"#eee"}}>欢迎您 { this.props.UserStore.user.u_realname } {type}</Text>
            </View>
        )
    }
    renderUnloginIcon=()=>{
        return(
            <View style={{alignSelf:'center'}}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Login')}>
                    <SvgUri svgXmlData={UnLogin} width="70" height="70"/>
                    <Text style={{fontSize:15,color:"#333",fontWeight:'bold'}}>登录/注册</Text>
                </TouchableOpacity>
            </View>
        )
    }
    renderLogoutBtn=()=>{
        return(
        <View style={styles.logout}>
            <TouchableOpacity 
                onPress={this.logoutBtn}
            >
                <View style={{justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontSize:14,color:"red"}}>退出登录</Text>
                </View>
            </TouchableOpacity>
        </View>
        )
    }

    //刷新
    onRefresh=async()=>{
        this.setState({ isRefreshing:true });
        this.getUser();
    }
    //是否退出提示框
    logoutBtn=()=>{
        Alert.alert(
            "退出登录",
            "是否确认退出？",
            [
                {
                    text:"取消",
                    onPress:()=>Toast.message("已取消",1000,"center"),
                    style:"cancel"
                },
                {
                    text:"确认",
                    onPress:()=>{
                        this.props.UserStore.setUser(null),
                        this.props.RootStore.setLoginStat()
                    }
                }
            ]
        )
    }
    render() {
        const {isRefreshing} =this.state
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={this.onRefresh} />}
                >
                <View>
                        <ImageBackground
                            source={require("../pic/Minepage2.png")}
                            style={{height:150}}
                        />
                    <View style={{ height: 150, justifyContent: "center", position:"absolute",alignSelf:"center"}} >
                        {this.props.RootStore.loginstat ? this.renderloginIcon():this.renderUnloginIcon()}
                    </View>
                </View>
                <View style={styles.centerBlock}>
                    <TouchableOpacity 
                    onPress={()=>{
                        console.log(this.state.LoginStat)
                        }
                    }
                 >
                        <View style={{marginLeft:10}}>
                            <SvgUri svgXmlData={Collect} width="35" height="35"/>
                        </View>
                        <Text style={{marginTop:5,fontSize:14,color:"#888"}}>我的收藏</Text>
                        {/* <Text>登陆状态：{this.props.RootStore.loginstat.toString()}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>console.log(this.props.navigation.params)}
                    >
                        <View style={{marginLeft:10}}>
                            <SvgUri svgXmlData={Plane} width="35" height="35"/>
                        </View>
                        <Text style={{marginTop:5,fontSize:14,color:"#888"}}>我的消息</Text>
                    </TouchableOpacity>
                </View>
                    {/* 选项栏 开始 */}
                    <View style={styles.bottomBlock}>
                        <TouchableOpacity>
                            <View style={{flexDirection:"row"}}>
                                <SvgUri svgXmlData={Tongxun} width="25" height="25"/>
                                <Text style={{marginTop:2,marginLeft:5,fontSize:14,color:"#555"}}>个人信息</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomBlock}>
                        <TouchableOpacity>
                            <View style={{flexDirection:"row"}}>
                                <SvgUri svgXmlData={Settings} width="25" height="25"/>
                                <Text style={{marginTop:2,marginLeft:5,fontSize:14,color:"#555"}}>通用设置</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomBlock}>
                        <TouchableOpacity>
                            <View style={{flexDirection:"row"}}>
                                <SvgUri svgXmlData={Talk} width="25" height="25"/>
                                <Text style={{marginTop:2,marginLeft:5,fontSize:14,color:"#555"}}>在线客服</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* 选项栏 结束 */}
                    {this.selectUserBar()}
                    {this.props.RootStore.loginstat ? this.renderLogoutBtn():null}
                        </ScrollView>
                {/* </ImageHeaderScrollView> */}

            </View>
        )
    }
}
const styles = StyleSheet.create({
container:{
    flex:1
},
FirstBlock:{
    flexDirection:'row',
    borderWidth:1,
    height:100,
    backgroundColor:'red'
},
LPicBlock:{
    flex:1,
    width:50,
    height:100,
    backgroundColor:'yellow',
    borderWidth:2,
},
RPicBolck:{
    flex:2,
    width:50,
    height:100,
    backgroundColor:'aqua',
    justifyContent:'center'
},
button: {
    height: 50,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#66f',
    marginTop: 20,
},
btText: {
    color: '#fff',
    fontSize: 20,
},
centerBlock:{
    width:"90%",
    height:120,
    alignSelf:"center",
    borderRadius:10,
    marginBottom:10,
    marginTop:-15,
    backgroundColor:"#fff",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
},
bottomBlock:{
    width:"100%",
    backgroundColor:"#fff",
    height:50,
    padding:10,
    justifyContent:"center",
    borderBottomWidth:0.2,
    borderBottomColor:"#C0C0C0"
},
logout:{
    width:"100%",
    backgroundColor:"#fff",
    height:60,
    marginTop:10,
    padding:10,
    justifyContent:"center",
    borderTopWidth:0.2,
    borderBottomWidth:0.2,
    borderTopColor:"#C0C0C0",
    borderBottomColor:"#C0C0C0"
}
})

