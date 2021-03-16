import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    View,
    Image,
    StatusBar,
    Text,
    Alert,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';  
import validator from "../../../utils/validator";
import request from "../../../utils/request";
import Toast from "../../../utils/Toast";
import LoginButton from "../../../components/LoginButton";
import { 
    ACCOUNT_LOGIN,
    ACCOUNT_FINDBYID,
    ACCOUNT_FINDALL
} from "../../../utils/pathMap";
import { inject,observer } from "mobx-react";
import JMessage from '../../../utils/JMessage';

@inject("RootStore","UserStore")
@observer
export default class index extends Component {
    state={
        username : "asdas",
        password : null ,
        //用户名是否合法
        userValidate: true,
        loginstat:false
    }
    componentDidMount() {
        console.log("~~~~~~~~~~~~~~~~~~~~~~");
        console.log(this.props);
    }
    // constructor(){
    //     super();
    //     Toast.showLoading("请求中...")
    //     setTimeout(() => {
    //         Toast.hideLoading();
    //     }, 2000);
    // }
    //用户名改变事件
    usernameChange=(username)=>{
        this.setState({ username});
        console.log(username)
    }
    passwordChange=(password)=>{
        this.setState({ password });
        console.log(password)
    }
    /**
     * 点击空白处使输入框失去焦点
     */
    blurTextInput = () => {
        this.refs.username.blur();
        this.refs.password.blur();
    }

    // 用户名密码提交事件
    userNameOnSubmit=async()=>{
        //获取解构
        const {username} = this.state;
        const userValidate = validator.validateUsername(username);
        if(!userValidate){
            //没有通过 弹窗
            this.setState({ userValidate });
            return;
        }
    }
    passwordOnSubmit=async()=>{
        const {password} = this.state;
        
        const res = await request.post(ACCOUNT_LOGIN,{
            u_username:this.state.username,
            u_password:password
        })
        console.log(res)
        var userid = res.data.u_id.toString()
        console.log(userid);
        if(res.data!=null){
            //请求成功
            this.props.UserStore.setUser(res.data);
            //极光登录
            await JMessage.login(userid,res.data.u_phone)
            this.loginSuccess();
        }else{
            Alert.alert("登陆失败","用户名或密码错误");
        }
    }
    
    loginSubmit=async()=>{
        const {u_username,u_password} = this.state
        if(!u_username||!u_password){
            Toast.sad("还有信息没有填哦,请检查")
            return;
        }
        const res = await request.post(ACCOUNT_LOGIN,{
            u_username:this.state.username,
            u_password:this.state.password
        })
        if(res.data!=null){
            //请求成功
            this.props.UserStore.setUser(res.data);
            //极光登录
            // await JMessage.login(res.data.u_id,res.data.u_phone)
            this.loginSuccess();
        }else{
            Alert.alert("登陆失败","用户名或密码错误");
        }

    }
    refresh=(state)=>{
        this.setState({ loginStat:state  });
    }
    //登陆成功跳转主页面
    loginSuccess=()=>{
        // this.props.navigation.goBack();
        this.props.RootStore.setLoginStat();
        this.props.navigation.navigate("Nav")

        Toast.message("登陆成功！",1000)
    }
    render() {
        const {userValidate,showLogin} = this.state;
        return (
            // <View>
            //     <StatusBar backgroundColor="transparent" translucent={true}/>
            //     <Image style={styles.bgpic} source={require("../../../pic/bg1.jpg")} />
           
            <TouchableOpacity //用可点击的组件作为背景
                activeOpacity={1.0}//设置背景被点击时的透明度改变值
                onPress={this.blurTextInput}
                style={styles.container}>
                <StatusBar backgroundColor="transparent" translucent={true}/>
                <Image style={styles.bgpic} source={require("../../../pic/bg1.jpg")} />

                <View style={styles.inputBox1}>
                    <Input
                        style={styles.input}
                        ref="username"
                        autoCapitalize='none'  //设置首字母不自动大写
                        underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                        placeholderTextColor={'gray'}  //设置占位符颜色
                        onChangeText={this.usernameChange}
                        placeholder='用户名/手机号' //设置占位符
                        errorMessage={userValidate ?"":"用户名格式不正确"}
                        maxLength={15}
                        onSubmitEditing={this.userNameOnSubmit}
                    />
                </View>
                <View style={styles.inputBox2}>
                    <Input
                        style={styles.input}
                        ref="password"
                        autoCapitalize='none'  //设置首字母不自动大写
                        underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                        secureTextEntry={true}  //设置为密码输入框
                        placeholderTextColor={'gray'}  //设置占位符颜色
                        onChangeText={this.passwordChange}
                        placeholder={'密码'}  //设置占位符
                        onSubmitEditing={this.passwordOnSubmit}
                    />
                </View>
                <View>
                    <View style={styles.LoginButton}>
                        <LoginButton onPress={this.loginSubmit}>登录</LoginButton>
                    </View>
                </View>
                {/* <TouchableOpacity
                    style={styles.subbutton}
                    onPress={this.loginSubmit}
                    >                
                    <Text
                        style={styles.btText}>登录</Text>  
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={styles.regbutton}
                    onPress={()=>this.props.navigation.navigate('Register')}
                    >
                    <Text
                        style={styles.btText}>注册</Text> 
                </TouchableOpacity>
                </TouchableOpacity>

            // </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    bgpic:{
        width:"100%",
        height:200
    },
    input: {
        marginTop:10,
        width: 250,
        height: 40,
        fontSize: 13,
        color: '#333',//输入框输入的文本为白色
    },
    inputBox1: {
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 260,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'lightgray',
        marginBottom: 18,
    },
    inputBox2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 260,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'lightgray',
        marginBottom: 8,
    },
    LoginButton:{
        marginTop:10,
        width:200,
        height:40,
        alignSelf:"center",
    },
    regbutton: {
        width:200,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        backgroundColor: "#00CED1",
        marginTop: 20,
    },
    btText: {
        color: '#fff',
        fontSize: 20,
    }
});