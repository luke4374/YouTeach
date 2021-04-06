import { inject, observer } from 'mobx-react';
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import TopNav from "../../../components/TopNav";
import { ListItem,Overlay } from "react-native-elements";
import date from "../../../utils/date";
import { ACCOUNT_UPDATE,ACCOUNT_LOGIN } from "../../../utils/pathMap";
import request from "../../../utils/request";
import DatePicker from 'react-native-datepicker'
import Toast from '../../../utils/Toast';
import { male,female } from "../../../res/fonts/iconSg";
import SvgUri from 'react-native-svg-uri';
import { TouchableOpacity } from 'react-native';

@inject("UserStore")
@observer
export default class index extends Component {

    state={
        showNickname:false,
        showGender:false,
        showGrade:false
    }
    nicknameUpdate=async(e)=>{
        //非受控表单
        const u_nickname = e.nativeEvent.text;
        if(!u_nickname) return;
        await this.onSubmitUser({u_id:this.props.UserStore.user.u_id,u_nickname});
        this.setState({ showNickname: false });
    }
    birthdayUpdate=async(u_birthday)=>{
        // console.log(birthday);
        await this.onSubmitUser({u_id:this.props.UserStore.user.u_id,u_birthday});
    }
    genderUpdate=async(u_gender)=>{
        // alert(u_gender);
        await this.onSubmitUser({u_id:this.props.UserStore.user.u_id,u_gender});
        this.setState({ showGender: false });
    }
    gradeUpdate=async(u_grade)=>{
        await this.onSubmitUser({u_id:this.props.UserStore.user.u_id,u_grade});
        this.setState({ showGrade: false });
    }
    onSubmitUser=async(user)=>{
        const res = await request.post(ACCOUNT_UPDATE,user);
        console.log(user);
        Toast.smile("修改成功");
        //重新获取数据
        const refresh = await request.post(ACCOUNT_LOGIN,{
            u_username:this.props.UserStore.user.u_username,
            u_password:this.props.UserStore.user.u_password
        })
        this.props.UserStore.setUser(refresh.data);
        return Promise.resolve(res);
    } 

    render() {
        const user = this.props.UserStore.user;
        const {showNickname,showGender,showGrade} =this.state;
        return (
            <View style={{flex:1}}>

                <Overlay visible={showNickname} onBackdropPress={()=>this.setState({ showNickname: false })} >
                    <TextInput 
                        style={{width:200}}
                        placeholder="修改昵称"
                        onSubmitEditing={this.nicknameUpdate}/>
                </Overlay>

                <Overlay visible={showGender} onBackdropPress={()=>this.setState({ genderUpdate: false })}>
                    <View style={styles.genderOverlay}>
                        <TouchableOpacity style={{alignItems:"center"}} onPress={()=>this.genderUpdate("男")}>
                            <SvgUri svgXmlData={male} height="40" width="40"/>
                            <Text style={{color:"#666"}}>男</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems:"center"}} onPress={()=>this.genderUpdate("女")}>
                            <SvgUri svgXmlData={female} height="40" width="40"/>
                            <Text style={{color:"#666"}}>女</Text>
                        </TouchableOpacity>
                    </View>
                </Overlay>
                <Overlay visible={showGrade} onBackdropPress={()=>this.setState({ showGrade: false })}>
                    <View style={styles.genderOverlay}>
                        <TouchableOpacity onPress={()=>this.gradeUpdate("初一")}><Text>初一</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.gradeUpdate("初二")}><Text>初二</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.gradeUpdate("初三")}><Text>初三</Text></TouchableOpacity>
                    </View>
                </Overlay>
                <TopNav title="编辑个人信息"/>
                {/* 用户信息 */}
                <ListItem bottomDivider onPress={()=>this.setState({ showNickname: true })}>
                    <ListItem.Content style={{position:"relative"}}>
                        <ListItem.Title>昵称</ListItem.Title>
                        <View  style={styles.subtitleView}>
                            <Text style={styles.ratingText}>{user.u_nickname}</Text>
                            <ListItem.Chevron size={20}/>
                        </View>
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider>
                    <ListItem.Content style={{position:"relative"}}>
                        <ListItem.Title>真实姓名</ListItem.Title>
                        <View  style={styles.subtitleView}>
                            <Text style={{marginRight:20,color:"#666"}}>{user.u_realname}</Text>
                            {/* <ListItem.Chevron size={20}/> */}
                        </View>
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider onPress={()=>this.setState({ showGender: true })}>
                    <ListItem.Content style={{position:"relative"}}>
                        <ListItem.Title>性别</ListItem.Title>
                        <View  style={styles.subtitleView}>
                            <Text style={styles.ratingText}>{user.u_gender}</Text>
                            <ListItem.Chevron size={20}/>
                        </View>
                    </ListItem.Content>
                </ListItem>
                
                <ListItem bottomDivider>
                    <ListItem.Content style={{position:"relative"}}>
                        <ListItem.Title>生日</ListItem.Title>
                        <View style={styles.subtitleView}>
                            <Text style={styles.ratingText}>{date(user.u_birthday).format("YYYY-MM-DD")}</Text>
                            <ListItem.Chevron size={20}/>

                        </View>
                        <DatePicker
                                androidMode="spinner"
                                style={{width: "120%",position:"absolute",top:-12,left:-10,height:"100%",opacity:0}}
                                date={date(user.u_birthday).format("YYYY-MM-DD")}
                                mode="date"
                                placeholder="设置生日"
                                format="YYYY-MM-DD"
                                minDate="1900-01-01"
                                maxDate={date(new Date()).format("YYYY-MM-DD")}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={this.birthdayUpdate}
                            />
                    </ListItem.Content>
                </ListItem>

                <ListItem bottomDivider onPress={()=>this.setState({ showGrade: true })}>
                    <ListItem.Content style={{position:"relative"}}>
                        <ListItem.Title>年级</ListItem.Title>
                        <View  style={styles.subtitleView}>
                            <Text style={styles.ratingText}>{user.u_grade}</Text>
                            <ListItem.Chevron size={20}/>
                        </View>
                    </ListItem.Content>
                </ListItem>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    subtitleView: {
      flexDirection: 'row',
      paddingLeft: 10,
      paddingTop: 5,
      position:"absolute",
      right:0
    },
    ratingText: {
      paddingLeft: 10,
      color: 'grey'
    },
    genderOverlay:{
        width:200,
        height:60,
        flexDirection:"row",
        justifyContent:"space-evenly",
        alignItems:"center"
    }

  })