import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    StatusBar,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Input } from 'react-native-elements';  
import validator from "../../../utils/validator";
import { 
    ACCOUNT_VCODE, 
    ACCOUNT_REPCHECK, 
    ACCOUNT_SAVE, 
    ACCOUNT_LOGIN
} from "../../../utils/pathMap";
import LoginButton from "../../../components/LoginButton";
import request from '../../../utils/request';
import Toast from "../../../utils/Toast";
import {
    CodeField,
    Cursor
  } from 'react-native-confirmation-code-field';
import { inject,observer } from "mobx-react";

const {deviceWidth,deviceHeight} = Dimensions.get('window')
@inject("RootStore")
@observer
export default class Register extends Component {
    state={
        phoneNum:"",
        password: "" ,
        confirmPw: "" ,
        phoneValidate: true,
        //是否显示登陆页面
        showLogin:true,
        //验证码输入框的值
        vcodeTxt:"",
        //倒计时按钮文本
        btnText:"重新获取",
        //是否在倒计时中
        isCountDown:false
    }
    /**
     * 点击空白处使输入框失去焦点
     */
    blurTextInput = () => {
        this.refs.phoneNum.blur();
        this.refs.password.blur();
        this.refs.confirmPassword.blur();
    }
    phoneNumChange=(phoneNum)=>{
        this.setState({ phoneNum });
    }
    passwordChange=(password)=>{
        this.setState({ password });
        console.log(password)
    }
    confirmPw=(confirmPw)=>{
        this.setState({ confirmPw });
    }
    phoneNumOnSubmit=async()=>{
        //获取解构
        const {phoneNum} = this.state;
        const phoneValidate = validator.validatePhone(phoneNum);
        if(!phoneValidate){
            //没有通过 弹窗
            this.setState({ phoneValidate });
            return;
        }else{
            this.setState({ phoneValidate });
        }

    }
    register=async()=>{
        const{phoneNum,password,confirmPw,showLogin} = this.state;
        console.log(phoneNum,password)
        if(phoneNum != '' && password!=''){
            const res = await request.get(ACCOUNT_REPCHECK+`/${phoneNum}`);
            if(res.data==null){
                //新用户
                if(password === confirmPw){
                    const vcode = await request.get(ACCOUNT_VCODE)
                    console.log(vcode.status)
                    if(vcode.status == "1"){
                        //SUCCESS
                        this.setState({ showLogin : false });
                        // 开启定时器
                        this.countDown();
                    }else{
                        //FAILED
                        Toast.message("请求失败,稍后再试",1500,"center")
                    }
                }else{
                    Toast.message("密码与确认密码不同",1500,"center")
                }
            }else{
                Toast.message("该手机号已被注册",1500,"center")
            }
        }else{
            Toast.message("用户名或密码不能为空",1500,"center")
        }
    }
    //验证码填写完成事件
    onVcodeSubmit=async()=>{
        /*
        1 对验证码长度进行校验
        2 将手机号和验证码一起发到后台
        3 返回值 isNew
            1.新用户 ->完善个人信息页面
            2.老用户 ->提示"已经注册过请登录"
        */
       const {vcodeTxt,phoneNum,password} = this.state
       if(vcodeTxt.length!=6){
        Toast.message("验证码不正确",1500,"center");
        return;
       }else if(vcodeTxt == 888888){
        //    const res = await request.get(ACCOUNT_REPCHECK+`/${phoneNum}`);
        //    console.log(res.data)
        //    if(res.data == null){
        //        //新用户
        //     //    alert("New User")
            const save = await request.post(ACCOUNT_SAVE,{
                u_username:phoneNum,
                u_password:password,
                u_nickname:phoneNum,
                u_status:0,
                u_phone:phoneNum
            })
            if(save.status == 1){
                const userInfo = await request.get(ACCOUNT_REPCHECK+`/${phoneNum}`);
                console.log(userInfo)
                this.props.RootStore.setUserInfo(phoneNum,userInfo.data.u_id);
                this.props.navigation.navigate('UserInfo',{u_phone:phoneNum});
            }else{
                Toast.message("请求失败，请重试",1000,"center")
            }
        //    }else{
        //       //老用户
        //       alert("Old User")

        //    }
       }
   
       
    }
    // 开启获取验证码定时器
    countDown=()=>{
        if(this.state.isCountDown){
            return;
        }
        this.setState({ isCountDown: true });
        let seconds=10;
        //重新获取(10s)
        this.setState({ btnText: `重新获取(${seconds}s)` });
        let timeId=setInterval(() => {
            seconds--;
            this.setState({ btnText: `重新获取(${seconds}s)` });
            if(seconds === 0){
                clearInterval(timeId);
                this.setState({ btnText: "重新获取", isCountDown: false });
            }
        }, 1000);
    }
    //重新获取按钮事件
    repGetVcode=()=>{
        this.countDown();
    }
    //渲染注册页面
    renderRegister=()=>{
        const {phoneValidate} = this.state
        return <View style={styles.container}>

        <View style={{marginLeft:-180,marginBottom:8}}>
            <Text style={styles.regtitle}>手机号注册</Text>
        </View>

        <View style={styles.inputBox}>
            <Input
                leftIcon={{ type: 'font-awesome', name: 'phone', size:15, marginTop:10, color:'gray'}}
                style={styles.input}
                ref="phoneNum"
                autoCapitalize='none'  //设置首字母不自动大写
                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                placeholderTextColor={'gray'}  //设置占位符颜色
                placeholder={'手机号'}  //设置占位符
                keyboardType='number-pad'
                onChangeText={this.phoneNumChange}
                onSubmitEditing={this.phoneNumOnSubmit}
                errorMessage={phoneValidate ? "":"手机号格式不正确"}
            />
        </View>

        <View
            style={styles.inputBox}>
            <Input
            leftIcon={{ type: 'font-awesome', name: 'lock' ,size:15, marginTop:10, color:'gray'}}
                style={styles.input}
                ref="password"
                secureTextEntry={true}  //设置为密码输入框
                autoCapitalize='none'  //设置首字母不自动大写
                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                placeholderTextColor={'gray'}  //设置占位符颜色
                placeholder={'密码'}  //设置占位符
                onChangeText={this.passwordChange}
            />
        </View>
        <View
            style={styles.inputBox}>

            <Input
                leftIcon={{ type: 'font-awesome', name: 'lock' ,size:15,marginTop:10,color:'gray'}}
                style={styles.input}
                ref="confirmPassword"
                secureTextEntry={true}  //设置为密码输入框
                autoCapitalize='none'  //设置首字母不自动大写
                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                placeholderTextColor={'gray'}  //设置占位符颜色
                placeholder={'确认密码'}  //设置占位符
                onChangeText={this.confirmPw}
            />

        </View>

        <TouchableOpacity
                    onPress={this.register}
                    style={styles.button}>
                    <Text
                        style={styles.btText}>获取验证码</Text>
        </TouchableOpacity>


        </View>

    }

    //渲染填写验证码页面
    renderVcode=()=>{
        const {phoneNum,vcodeTxt,btnText,isCountDown} = this.state
        return <View style={{                
            marginLeft:10,
            marginRight:10
        }}>
            <View style={{
                marginTop:15,
                marginBottom:10
                }}>
                    <Text style={styles.vcodeText}>请输入6位验证码</Text>
            </View>
            <View><Text style={styles.vcodeText2}>已发到:+86 {phoneNum}</Text></View>
            <View>
                {/* 验证码输入框 */}
                <CodeField
                    value={vcodeTxt}
                    onChangeText={this.onVcodeChange}
                    cellCount={6}
                    onSubmitEditing={this.onVcodeSubmit}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    renderCell={({index, symbol, isFocused}) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        >
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                    )}
                />
            </View>
            <View><LoginButton disabled={isCountDown} onPress={this.repGetVcode} style={styles.requireButton}>{btnText}</LoginButton></View>
        </View>
    }
    // 验证码输入框值改变事件
    onVcodeChange=(vcodeTxt)=>{
        this.setState({ vcodeTxt });
     }

    //入口
    render() {
        const {phoneValidate,showLogin} = this.state
        return (
            <TouchableOpacity activeOpacity={1.0} style={{flex: 1}} onPress={this.blurTextInput}>
                {/* 键盘弹起 开始 */}
                {/* <KeyboardAvoidingView
                    style={{flex:1}}
                    behavior="padding"
                    keyboardVerticalOffset={Platform.select({ios:10,android:10})}
                    enabled
                > */}
                {/* <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps="always" > */}
                {/* 键盘弹起 结束 */}
                    <StatusBar backgroundColor="transparent" translucent={true}/>
                    <Image style={styles.bgpic} source={require("../../../pic/bg2.jpg")} />
                    {showLogin ? this.renderRegister():this.renderVcode()}
                {/* </KeyboardAwareScrollView> */}
                {/* </KeyboardAvoidingView> */}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    bgpic:{
        width:"100%",
        height:200
    },
    regtitle:{
        fontSize:20,
        color:"#888",
        fontWeight:"bold",
    },
    input: {
        marginTop:10,
        width: 200,
        height: 20,
        fontSize: 14,
        color: '#333',//输入框输入的文本为白色
    },
    inputBox: {
        // marginTop:10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 260,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'lightgray',
        marginBottom: 18,
    },
    button: {
        height: 40,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#00CED1',
        marginTop: 20,
    },
    requireButton:{
        marginTop:15,
        width:"75%",
        height:40,
        alignSelf:"center",
    },
    btText: {
        color: '#fff',
        fontSize: 16,
    },
    vcodeText:{
        fontSize:18,
        color:"#666",
        fontWeight:'bold'
    },
    vcodeText2:{
        fontSize:14,
        color:"#333",
        fontWeight:'normal'
    },
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderBottomWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
      color:'#00CED1'
  
    },
    focusCell: {
      borderColor: '#00CED1',
    },
    keyboardview:{
        width: 200,
        height: 20,
        fontSize: 14,
        color: '#333'
    }
});