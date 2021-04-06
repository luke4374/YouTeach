import { inject, observer } from 'mobx-react';
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import TopNav from "../../components/TopNav";
import SubmitButton from "../../components/LoginButton";
import { ADD_TEACHERINFO } from "../../utils/pathMap";
import request from "../../utils/request";
import DatePicker from 'react-native-datepicker'
import Toast from '../../utils/Toast';
import { male,female } from "../../res/fonts/iconSg";
import SvgUri from 'react-native-svg-uri';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';

@inject("UserStore")
@observer
export default class UpdateInfo extends Component {

    state={
        t_number:"",
        t_exp:"",
        t_res:"",
        t_description:"",
        t_subject:"",
        t_intro:""
    }


    updateInfo=async()=>{
        const {t_number,t_exp,t_res,t_description,t_subject,t_intro} = this.state;
        const res = await request.post(ADD_TEACHERINFO,{
            u_id:this.props.UserStore.user.u_id,
            t_number:t_number,
            t_exp:t_exp,
            t_res:t_res,
            t_description:t_description,
            t_subject:t_subject,
            t_intro:t_intro
        })
        console.log(res);
    }

    numberChange=(t_number)=>{
        this.setState({ t_number});
        console.log(t_number)
    }
    expChange=(t_exp)=>{
        this.setState({ t_exp });
    }
    resChange=(t_res)=>{
        this.setState({ t_res });
    }
    descChange=(t_description)=>{
        this.setState({ t_description });
    }
    subjectChange=(t_subject)=>{
        this.setState({ t_subject });
    }
    introChange=(t_intro)=>{
        this.setState({ t_intro });
    }

    onSubmit=async()=>{
        await this.updateInfo();
        Toast.smile("更新成功");
    }
    render() {
        return (
            <View style={{flex:1}}>
                <TopNav title="教师信息上传"/>
                <ScrollView style={styles.container}>
                    
                    <View>
                        <Text style={{fontSize:15}}>教师资质</Text>
                        <View style={{alignItems:"center",padding:5}}>
                            <TextInput
                                style={{width:"90%",borderRadius:5,backgroundColor:"#FFF"}}
                                onChangeText={this.numberChange}
                                placeholder="请输入教师资质号码"
                                maxLength={20}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:15}}>教学经历</Text>
                        <View style={{alignItems:"center",padding:5}}>
                            <TextInput
                                style={{width:"90%",borderRadius:5,backgroundColor:"#FFF"}}
                                onChangeText={this.expChange}
                                placeholder="请输入教师教学经历"
                                multiline={true}
                                numberOfLines={5}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:15}}>教学成果</Text>
                        <View style={{alignItems:"center",padding:5}}>
                            <TextInput
                                style={{width:"90%",borderRadius:5,backgroundColor:"#FFF"}}
                                onChangeText={this.resChange}
                                placeholder="请输入教师教学成果"
                                multiline={true}
                                numberOfLines={4}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:15}}>教学特点</Text>
                        <View style={{alignItems:"center",padding:5}}>
                            <TextInput
                                style={{width:"90%",borderRadius:5,backgroundColor:"#FFF"}}
                                onChangeText={this.descChange}
                                placeholder="请输入教师教学特点"
                                multiline={true}
                                numberOfLines={4}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:15}}>教授科目</Text>
                        <View style={{alignItems:"center",padding:5}}>
                            <TextInput
                                style={{width:"90%",borderRadius:5,backgroundColor:"#FFF"}}
                                onChangeText={this.subjectChange}
                                placeholder="请输入教师教授科目"
                                maxLength={10}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:15}}>个人介绍</Text>
                        <View style={{alignItems:"center",padding:5}}>
                            <TextInput
                                style={{width:"90%",borderRadius:5,backgroundColor:"#FFF"}}
                                onChangeText={this.introChange}
                                placeholder="请输入个人介绍"
                                maxLength={20}
                            />
                        </View>
                    </View>
                    <SubmitButton style={styles.submit} onPress={this.onSubmit}>提交</SubmitButton>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        padding:10,
        flex:1,
    },
    submit:{
        marginTop:10,
        marginBottom:10,
        width:200,
        height:40,
        alignSelf:"center",
    },
})