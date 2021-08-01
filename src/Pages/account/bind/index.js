import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Text, View,ImageBackground,TouchableOpacity,StyleSheet,TextInput,ScrollView,Image } from 'react-native'
import Feather from "react-native-vector-icons/Feather" ;
import request from "../../../utils/request";
import { ACCOUNT_FINDBYID,Find_userByPhone,Send_Bind,Find_BindByUId,Find_BindByRId,Answer_Bind,FIND_COLL_BYUID,Find_Signing } from "../../../utils/pathMap";
import SvgUri from "react-native-svg-uri";
import { GirlIcon,BoyIcon } from "../../../res/fonts/iconSg";
import { ListItem,Overlay } from "react-native-elements";
import Toast from '../../../utils/Toast';
import date from "../../../utils/date";

@inject("UserStore")
@observer
export default class index extends Component {
    state = {
        isParent:this.props.UserStore.user.u_usertype == 2,
        bindReq:[],
        userInfo:[],
        uid:this.props.UserStore.user.u_id,
        showAdd:false,
        phoneNum:"",
        //绑定用户的信息
        collection:[],
        Course:[]
    }

    componentDidMount() {
        this.getResult();
    }

    getResult=async()=>{
        const {isParent} = this.state
        if(isParent){
            const res = await request.get(Find_BindByRId+this.props.UserStore.user.u_id)
            this.setState({ bindReq: res });
            // console.log("rid",res);
        }else{
            const res = await request.get(Find_BindByUId+this.props.UserStore.user.u_id)
            this.setState({ bindReq : res});
            // console.log("uid",res);
        }
        // console.log(this.state.bindReq);
    }

    getAccount=async()=>{
        const {bindReq,userInfo,isParent} = this.state
        console.log("R_ID",bindReq.r_id);
        if(userInfo.length == 0){
            if (isParent) {
                const user = await request.get(ACCOUNT_FINDBYID+bindReq.u_id);
                this.setState({ userInfo: user.data });
            }else{
                const user = await request.get(ACCOUNT_FINDBYID+bindReq.r_id);
                this.setState({ userInfo: user.data });
            }
        }
        console.log("用户信息：",userInfo);
    }

    selectIcon=()=>{
        const {userInfo} = this.state
        if( userInfo.u_gender == "男"){
            console.log("男人");
            return <SvgUri svgXmlData={BoyIcon} width="70" height="70"/>
        }else{
            console.log("女人");
            return <SvgUri svgXmlData={GirlIcon} width="70" height="70"/>
        }
    }
    confirmBind=async(rid)=>{
        const {uid} = this.state
        await request.get(Answer_Bind+uid+"/"+rid)
        Toast.message("绑定成功！",1000,"bottom")
    }
    
    onPressConfirm=(rid)=>{
        this.confirmBind(rid)
        this.getResult()
    }

    sendRequest=async(phoneNum)=>{
        this.setState({ phoneNum });
        // if(!phoneNum) return;
        console.log(phoneNum);
    }
    onPhoneSubmit=async()=>{
        const {uid,phoneNum} = this.state
        const res = await request.get(Find_userByPhone+phoneNum)
        const req = await request.post(Send_Bind,{
            u_id:res[0].u_id,
            r_id:uid,
            r_test:"请求绑定",
        }) 
        this.setState({ showAdd: false });
        Toast.message("已发送请求",1000,"center")
    }
    getBindInfo=async()=>{
        const {bindReq,userInfo,collection} = this.state
        if(collection.length == 0){
            const coll = await request.get(FIND_COLL_BYUID+userInfo.u_id);
            const course = await request.get(Find_Signing+userInfo.u_id);
            console.log(coll);
            this.setState({ 
                collection:coll,
                Course:course
            });
        }
    }

    renderCourse=()=>{
        const {Course} = this.state;
        return Course.map((v,i)=>
            <View style={{position:"relative"}}>
                <View style={styles.Course}>
                    <Image 
                        source={{uri:v.l_pic}} 
                        style={styles.pic}
                        />
                    <View style={{flex:1,marginLeft:20,marginTop:10}}>
                        <Text style={{fontSize:13}}>{v.l_title}</Text>
                        <Text style={{color:"#666",fontSize:12}}>开课时间:</Text>
                        <Text style={{fontSize:10,color:"#666"}}>{date(v.l_time).format("yyyy-MM-DD HH:mm")}</Text>
                    </View>
                </View>
                <View style={{borderBottomWidth:1,borderColor:"#888",marginBottom:6,marginTop:6}}/>
            </View>
        )
    }

    renderStu=()=>{
        const {bindReq,userInfo} = this.state
        console.log(bindReq);
        if(bindReq.length == 0){
            return <View style={{justifyContent:"center"}}>
                <Text style={{color:"#666"}}>还没有绑定信息哦~</Text>
            </View>
        }else if (bindReq.r_status == 0) {
            this.getAccount()
            return<View style={styles.stuBindedContainer}>
                <View style={styles.stuBinded}>
                    {this.selectIcon()}
                    <View style={{height:70,justifyContent:"center",marginLeft:10}}>
                        <Text>{userInfo.u_realname} 请求与您绑定</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.confirm} onPress={this.onPressConfirm.bind(this,bindReq.r_id)}>
                    <Text>确认绑定</Text>
                </TouchableOpacity>
            </View>
        }else{
            this.getAccount()
            return<View style={styles.stuBindedContainer}>
                <View style={styles.stuBinded}>
                    {this.selectIcon()}
                    <View style={{height:70,justifyContent:"center",marginLeft:10}}>
                        <Text>您已和 {userInfo.u_realname} 成功绑定</Text>
                    </View>
                </View>
            </View>
        }
    }

    renderPar=()=>{
        const {bindReq,userInfo,collection} = this.state
        if(bindReq.length == 0){
            return <View>
                <Text>没有绑定信息</Text>
            </View>
        }else if (bindReq.r_status == 0) {
            console.log(userInfo);
            this.getAccount()
            return<View style={styles.stuBindedContainer}>
                <View style={styles.stuBinded}>
                    {this.selectIcon()}
                    <View style={{height:70,justifyContent:"center",marginLeft:10}}>
                        <Text>{userInfo.u_realname} 已收到您的绑定申请</Text>
                    </View>
                </View>
                <View style={{alignItems:"center"}}>
                    <Text style={{color:"orange"}}>待确认...</Text>
                </View>
            </View>
        }else{
            this.getAccount()
            this.getBindInfo()
            return<View style={styles.parentBlock}>
                {/* 第一层 */}
                <View style={styles.parentBinded}>
                    {this.selectIcon()}
                    <View style={{marginLeft:15,marginTop:10}}>
                        <Text >学生姓名：{userInfo.u_realname}</Text>
                        <Text>生日：{date(userInfo.u_birthday).format("YYYY-MM-DD")}</Text>
                    </View>
                </View>
                {/* 第二层 */}
                <ScrollView>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>收藏信息</Text>    
                    <View>
                        {collection.map((v,i)=>
                        <View style={{justifyContent:"center"}}>
                            <TouchableOpacity style={{flexDirection:"row",height:85,padding:6}}
                                onPress={()=>this.props.navigation.navigate('Video',{
                                    c_id:v.c_id,
                                    c_subject:v.c_subject
                                })}
                            >
                                <View style={{width:"38%"}}>
                                    <Image 
                                        source={{uri:v.c_pic}} 
                                        style={{width:100,height:70,borderRadius:15}}
                                    />
                                </View>
                                <View style={{width:"63%",position:"relative",margin:10}}>
                                    <Text style={{marginBottom:10,fontSize:12}}>{v.c_name}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width:"100%",height:1,backgroundColor:"lightgray"}}></View>
                        </View>
                        )}
                    </View>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>报名信息</Text>
                    {this.renderCourse()}
                </ScrollView>
            </View>
        }
    }

    render() {
        const {isParent,showAdd} = this.state
        return (
            <View style={styles.container}>
                {/* 顶部栏 */}
                <View>
                    <ImageBackground 
                        source={require("../../../pic/headbg.jpg")}
                        style={styles.backGroundImage}
                    >
                        <TouchableOpacity 
                            style={{flexDirection:'row',width:80}}
                            onPress={()=>this.props.navigation.goBack()}
                            >
                            <Feather name="chevron-left" size={20} style={{color:"#fff"}}/>
                            <Text style={{color:"#fff"}}>返回</Text>
                        </TouchableOpacity>
                        <Text style={{marginRight:50,color:"#fff",fontSize:15,fontWeight:"bold"}}>绑定</Text>
                        {isParent?
                            <TouchableOpacity onPress={()=> this.setState({ showAdd: true })}>
                                <Feather name="plus" size={20} style={{color:"#fff"}}/>
                            </TouchableOpacity>
                          :
                            <Text style={{width:"5%"}}></Text>    
                        }
                    </ImageBackground>

                    <Overlay visible={showAdd} onBackdropPress={()=>this.setState({ showAdd: false })}>
                        <View style={styles.genderOverlay}>
                            <TextInput 
                                style={{width:200}}
                                placeholder="请输入手机号"
                                onSubmitEditing={this.onPhoneSubmit}
                                onChangeText={this.sendRequest}
                                />
                            <TouchableOpacity onPress={this.onPhoneSubmit} style={styles.sendBtn}>
                                <Text>发送绑定请求</Text>
                            </TouchableOpacity>
                        </View>
                    </Overlay>
                </View>
                {/* 主体 */}
                <View style={styles.bindContainer}>
                    {isParent?this.renderPar():this.renderStu()}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgb(240,240,240)"
    },
    backGroundImage:{
        height:60,
        paddingTop:15,
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"space-between"
    },
    bindContainer:{
        alignItems:"center",
        padding:10
    },
    stuBindedContainer:{
        width:"90%",
        height:150,
        backgroundColor:"#FFF",
        borderRadius:20,
        // flexDirection:"row",
        padding:10,
        position:"relative"
    },
    stuBinded:{
        height:80,
        flexDirection:"row",
        justifyContent:"center",
    },
    confirm:{
        position:"absolute",
        backgroundColor:"lightgreen",
        right:20,
        bottom:20,
        width:80,
        height:40,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:20
    },
    genderOverlay:{
        width:200,
        height:100,
        justifyContent:"space-evenly",
        alignItems:"center"
    },
    sendBtn:{
        backgroundColor:"lightgreen",
        width:100,
        height:40,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:20
    },
    parentBlock:{
        width:"90%",
        height:400,
        backgroundColor:"#FFF",
        borderRadius:20,
        // flexDirection:"row",
        padding:10,
    },    
    parentBinded:{
        height:80,
        flexDirection:"row",
        borderBottomColor:"#999",
        borderBottomWidth:1
    },
    Course:{
        width:"93%",
        height:80,
        flexDirection:"row",
    },
    pic:{
        height:70,
        width:150,
        borderRadius:10,
        flex:1,
        marginTop:5
    },
})