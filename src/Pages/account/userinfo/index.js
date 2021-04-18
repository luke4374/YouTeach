import React, { Component } from 'react'
import { 
    Text, 
    View,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native'
import SvgUri from "react-native-svg-uri";
import { 
    male,
    female 
} from "../../../res/fonts/iconSg";
import { 
    Input,
    ButtonGroup
} from "react-native-elements";
import DatePicker from 'react-native-datepicker'
import Picker from "react-native-picker";
import SubmitBtn from "../../../components/LoginButton";
import Toast from "../../../utils/Toast";
import ImagePicker from "react-native-image-crop-picker";
import { Overlay } from "teaset";
import request from "../../../utils/request";
import { ACCOUNT_REGUPDATE,ACCOUNT_SAVE } from "../../../utils/pathMap";
import { inject,observer } from "mobx-react";
import JMessage from "../../../utils/JMessage";

@inject("RootStore")
@observer
export default class index extends Component {
    grade=[
        '请选择年级','初一','初二','初三',
    ]
    state={
        //真实姓名
        u_realname:"",
        //性别
        u_gender:"男",
        //生日
        u_birthday:"",
        // 用户类别（学生、老师、家长）
        u_usertype:0,
        u_grade:"",
        //按钮选项
        buttons : ['学生', '老师', '家长'],
        phoneNum:""
    }
    componentDidMount(){
        //浮层
        // let overlayView = (
        //     <Overlay.View
        //       style={{alignItems: 'center', justifyContent: 'center'}}
        //       modal={true}
        //       overlayOpacity={0}
        //       ref={v => this.overlayView = v}
        //       >
        //       <View style={{backgroundColor: '#333', padding: 40, borderRadius: 15, alignItems: 'center'}}>
        //           <Text>hahaha</Text>
        //       </View>
        //     </Overlay.View>
        //   );
        //   Overlay.show(overlayView);
        // const {id,u_phone} = this.props.route.params;
        // console.log(id,u_phone)
        console.log(this.props);
    }
    //ChooseGender
    ChooseGender=(u_gender)=>{
        this.setState({ u_gender });
    }
    updateIndex=(u_usertype)=> {
        this.setState({ u_usertype });
        console.log(u_usertype)
      }
    showGrade=()=>{
        const {u_grade} = this.state
        Picker.init({
            pickerData: this.grade,
            selectedValue: ["请选择年级"],
            wheelFlex:[1],
            pickerConfirmBtnText:"确定",
            pickerCancelBtnText:"取消",
            pickerTitleText:"请选择年级",
            onPickerConfirm: data => {
                this.setState({ u_grade:data[0] });
                console.log(u_grade)
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }
    onSubmit=async()=>{
        /**
         * 校验 姓名 生日 年级不为空
         * 提交后台 完成注册
         * 成功 极光聊天注册
         * 跳转的登录
         */
        const {u_realname,u_grade,u_birthday,u_usertype,u_gender} = this.state;
        if(!u_realname||!u_grade||!u_birthday){
            Toast.sad("还有信息没有填哦,请检查")
            return;
        }
        // 头像
        // ImagePicker.openPicker({
        //     width:300,
        //     height:300,
        //     cropping:true
        // }).then(image=>{
        //     console.log(image);
        // });
        const {u_phone} = this.props.route.params;
        const update = await request.post(ACCOUNT_REGUPDATE,{
            u_phone:u_phone,
            u_realname:u_realname,
            u_gender:u_gender,
            u_birthday:u_birthday,
            u_usertype:u_usertype,
            u_grade:u_grade
        })
        console.log(update)
        if(update.status != 1){
            Toast.sad("注册失败...")
            return;
        }else{
            //极光注册
            const res = await this.JGBusiness(this.props.RootStore.userId.toString(),this.props.RootStore.mobile)
            console.log(res);
            Toast.message("注册成功!")
            this.props.navigation.navigate("Login");
        }

    }

    JGBusiness=async(username,password)=>{
        //App中进行初始化 
        return JMessage.register(username,password);
    }

    render() {
        const {u_gender,u_realname,u_grade,u_birthday,u_usertype,buttons} = this.state;
        const date = new Date();
        const Today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        return (
            <View style={styles.container}>
                {/* 标题 开始 */}
                <View>
                    <Text style={styles.text}>填写资料</Text>
                    <Text style={styles.text}>完善个人信息</Text>
                </View>
                {/* 标题 结束 */}
                {/* 性别 开始 */}
                <View style={styles.gender}>
                    <View style={styles.innergender}>
                        <TouchableOpacity onPress={this.ChooseGender.bind(this,"男")} style={{
                            width:60,
                            height:60,
                            borderRadius:30,
                            backgroundColor: u_gender==="男"?"red":"#eee",
                            justifyContent:'center',
                            alignItems:'center'
                        }} >
                            <SvgUri svgXmlData={male} width="49" height="49" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={this.ChooseGender.bind(this,"女")} style={{
                                width:60,
                                height:60,
                                borderRadius:30,
                                backgroundColor: u_gender === "女"?"red":"#eee",
                                justifyContent:'center',
                                alignItems:'center'
                        }}>
                            <SvgUri svgXmlData={female} width="49" height="49" />                     
                        </TouchableOpacity>
                    </View>
                 </View>
                 <View style={styles.innergender}>
                 <Text>男生</Text>
                 <Text>女生</Text>
                 </View>
                {/* 性别 结束 */}
                {/* 真实姓名 开始 */}
                <View>
                    <Input 
                        style={{
                            fontSize:15,
                            marginTop:10,
                            color:"#666"
                        }}
                        value={u_realname}
                        placeholder="请输入真实姓名"
                        onChangeText={(u_realname)=>this.setState({ u_realname })}
                    />
                </View>
                {/* 真实姓名 结束 */}
                {/* 生日开始 */}
                <View>
                    <DatePicker
                        androidMode="spinner"
                        style={{width: "100%"}}
                        date={u_birthday}
                        mode="date"
                        placeholder="设置生日"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate={Today}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            marginRight:10,
                            borderWidth:0,
                            borderBottomWidth:1.2,
                            alignItems:"flex-start"
                        },
                        placeholderText:{
                            color:"#afafaf"
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(u_birthday) => {this.setState({u_birthday})}}
                    />
                </View>
                {/* 生日结束 */}
                {/* 年级开始 */}
                <View style={{marginTop:15}}>
                    {/* <Picker
                        style={{borderBottomWidth:2}}
                        selectedValue={u_grade}
                        onValueChange={(u_grade)=>{this.setState({ u_grade })}}
                        >
                        {
                            this.grade.map((item,index)=>{
                                return <Picker.Item label={item.label} value={item.value}/>
                            })
                        }
                    </Picker> */}
                    <TouchableOpacity
                        onPress={this.showGrade}
                        >
                    <Input
                        style={{
                            fontSize:15,
                            marginTop:5,
                            color:"#666"
                        }}
                        placeholder="请选择年级"
                        value={u_grade}
                        disabled={true}
                        />
                    </TouchableOpacity>
                </View>
                {/* 年级结束 */}                
                {/* 身份开始 */}
                <View>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={u_usertype}
                        buttons={buttons}
                        containerStyle={{height: 50,marginTop:5}}
                    />
                </View>
                {/* 身份结束 */}
                <View>
                    <SubmitBtn 
                        style={styles.submitButton}
                        onPress={this.onSubmit}
                    >完成注册</SubmitBtn>
                </View>
            </View>
        )
    }
}
// const {u_gender} = this.state;
const styles = StyleSheet.create({

    container:{
        backgroundColor:"#fff",
        flex:1,
        padding:20
    },
    text:{
        fontSize:18,
        color:'#666',
        fontWeight:'200'
    },
    gender:{
        marginTop:20
    },
    innergender:{
        width:"60%",
        flexDirection:"row",
        alignSelf:'center',
        justifyContent:'space-around'
    },
    iconmale:{
        width:60,
        height:60,
        borderRadius:30,
        backgroundColor:"#eee",
        justifyContent:'center',
        alignItems:'center'
    },    
    submitButton:{
        marginTop:15,
        width:"75%",
        height:40,
        alignSelf:"center",
    },
})