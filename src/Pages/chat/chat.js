import React, { Component } from 'react'
import SvgUri from "react-native-svg-uri";
import { Text } from "react-native";

import { BoyIcon,maleTeacher,goBack } from "../../res/fonts/iconSg";
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Button,
  Platform,
} from 'react-native'
//文件操作库
import RNFS from'react-native-fs';

var ReactNative = require('react-native')
// 聊天ui库
import IMUI from 'aurora-imui-react-native'
import JMessage from '../../utils/JMessage'
import { inject, observer } from 'mobx-react';
import { TouchableOpacity } from 'react-native';
var InputView = IMUI.ChatInput
//消息展示列表
var MessageListView = IMUI.MessageList
// 总控制中心
const AuroraIController = IMUI.AuroraIMUIController
const window = Dimensions.get('window')


var themsgid = 1
// 负责创建各种类型的消息
function constructNormalMessage() {
    // 创建一个消息对象
  const message = {}
  message.msgId = themsgid.toString()
  themsgid += 1
//   消息的状态 = >发送完成
  message.status = "send_succeed";
//   当前这条信息 是发出去的 还是接收的
  message.isOutgoing = true;
//   const date = new Date()
//   message.timeString = date.getHours() + ":" + date.getMinutes()
  message.timeString = "";
  message.fromUser = {
    userId: "",
    displayName: "",
    avatarPath: ""
  }
//   if (Platform.OS === "ios") {
//     user.avatarPath = RNFS.MainBundlePath + '/default_header.png'
//   }
//   message.fromUser = user

  return message
}



// class CustomVew extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }
//   render() {
//     return (<img src={`${RNFS.MainBundlePath}/default_header.png`}></img>)
//   }
// }
@inject("UserStore")
@observer
 class TestRNIMUI extends Component {
  constructor(props) {
    super(props);
    let initHeight;
    if (Platform.OS === "ios") {
      initHeight = 46
    } else {
      initHeight = 100
    }
    this.state = {
      inputLayoutHeight: initHeight,
      messageListLayout: { flex: 1, width: window.width, margin: 0 },
      inputViewLayout: { width: window.width, height: initHeight, },
      isAllowPullToRefresh: true,
      navigationBar: {},
    }
    

    this.updateLayout = this.updateLayout.bind(this);
    this.onMsgClick = this.onMsgClick.bind(this);
    this.messageListDidLoadEvent = this.messageListDidLoadEvent.bind(this);
  }

  componentDidMount() {
    /**
     * Android only
     * Must set menu height once, the height should be equals with the soft keyboard height so that the widget won't flash.
     * 在别的界面计算一次软键盘的高度，然后初始化一次菜单栏高度，如果用户唤起了软键盘，则之后会自动计算高度。
     */

    if (Platform.OS === "android") {
      this.refs["ChatInput"].setMenuContainerHeight(316)
    }
    this.resetMenu()
    AuroraIController.addMessageListDidLoadListener(this.messageListDidLoadEvent);
  }

  messageListDidLoadEvent() {
    this.getHistoryMessage()
  }
  //历史信息
   getHistoryMessage=async()=> {
      //获取极光历史信息
      const name = this.props.route.params.u_id;
      console.log(this.props.route.params.u_id);
      const username = name.toString();
      const from = 1;
      const limit = 10;
      const history = await JMessage.getHistoryMessage(username,from,limit);
      console.log("------------");
      console.log(history);
      console.log("----------------");    
      // console.log(this.props.route.params);
      console.log(this.props.UserStore.user);

      //消息数组
    var messages = []
    history.forEach(v=>{
        const message = constructNormalMessage();
        console.log(v.from.username);
        if(v.from.username != this.props.UserStore.user.u_id){
            //当前消息是属于发送者的
            message.isOutgoing = false;
            message.fromUser.avatarPath = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic2%2Fcover%2F00%2F36%2F49%2F5811d7c48840d_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619951390&t=a95a84e634999ea19e2f488538b9c8df";
          }else{
            message.isOutgoing = true;
            message.fromUser.avatarPath = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.51yuansu.com%2Fpic2%2Fcover%2F00%2F30%2F73%2F58108f4b2a480_610.jpg&refer=http%3A%2F%2Fwww.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg";
        }
        //设置消息相关的用户头像
        // message.fromUser.avatarUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534926548887&di=f107f4f8bd50fada6c5770ef27535277&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F11%2F67%2F23%2F69i58PICP37.jpg",//1
        // 当前消息种类
        if(v.type === "text"){
          message.msgType = 'text'
          // 设置消息内容
          message.text = v.text;
        }else if(v.type === "image"){
          message.msgType = 'image'
          // 设置消息内容
          message.mediaPath = v.thumbPath;
        }
        //发送时间
        message.timeString=(new Date(v.createTime)).toLocaleTimeString();
        //图片路径
        // message.mediaPath = imageUrlArray[index]
        // 聊天信息气泡大小
        message.contentSize = { 'height': 100, 'width': 200 }
        message.extras = { "extras": "fdfsf" }
        messages.push(message)
    })
    AuroraIController.appendMessages(messages)
    AuroraIController.scrollToBottom(true)

    // for (var i = 0; i < 10; i++) {
    //   var message = constructNormalMessage()
    //   message.msgType = 'custom'

    //   if (Platform.OS === "ios") {
    //     message.content = `
    //     <h5>This is a custom message. </h5>
    //     <img src="file://${RNFS.MainBundlePath}/default_header.png"/>
    //     `
    //   } else {
    //     message.content = '<body bgcolor="#ff3399"><h5>This is a custom message. </h5>\
    //     <img src="/storage/emulated/0/XhsEmoticonsKeyboard/Emoticons/wxemoticons/icon_040_cover.png"></img></body>'
    //   }

    //   var eventMessage = constructNormalMessage()
    //   eventMessage.msgType = "event"
    //   eventMessage.text = 'fsadfad'

    //   message.contentSize = { 'height': 100, 'width': 200 }
    //   message.extras = { "extras": "fdfsf" }
    //   AuroraIController.appendMessages([message, eventMessage])
    //   AuroraIController.scrollToBottom(true)
    // }
  }

  onInputViewSizeChange = (size) => {
    console.log("onInputViewSizeChange height: " + size.height + " width: " + size.width)
    if (this.state.inputLayoutHeight != size.height) {
      this.setState({
        inputLayoutHeight: size.height,
        inputViewLayout: { width: window.width, height: size.height },
        messageListLayout: { flex: 1, width: window.width, margin: 0 }
      })
    }
  }

  componentWillUnmount() {
    AuroraIController.removeMessageListDidLoadListener(this.messageListDidLoadEvent)
  }

  resetMenu() {
    if (Platform.OS === "android") {
      this.refs["ChatInput"].showMenu(false)
      this.setState({
        messageListLayout: { flex: 1, width: window.width, margin: 0 },
        navigationBar: { height: 64, justifyContent: 'center' },
      })
      this.forceUpdate();
    } else {
      AuroraIController.hidenFeatureView(true)
    }
  }

  /**
   * Android need this event to invoke onSizeChanged 
   */
  onTouchEditText = () => {
    this.refs["ChatInput"].showMenu(false)
  }

  onFullScreen = () => {
    console.log("on full screen")
    this.setState({
      messageListLayout: { flex: 0, width: 0, height: 0 },
      inputViewLayout: { flex: 1, width: window.width, height: window.height },
      navigationBar: { height: 0 }
    })
  }

  onRecoverScreen = () => {
    // this.setState({
    //   inputLayoutHeight: 100,
    //   messageListLayout: { flex: 1, width: window.width, margin: 0 },
    //   inputViewLayout: { flex: 0, width: window.width, height: 100 },
    //   navigationBar: { height: 64, justifyContent: 'center' }
    // })
  }

  onAvatarClick = (message) => {
    Alert.alert()
    AuroraIController.removeMessage(message.msgId)
  }

  onMsgClick(message) {
    console.log(message)
    Alert.alert("message", JSON.stringify(message))
  }

  onMsgLongClick = (message) => {
    Alert.alert('message bubble on long press', 'message bubble on long press')
  }

  onStatusViewClick = (message) => {
    message.status = 'send_succeed'
    AuroraIController.updateMessage(message)
  }

  onBeginDragMessageList = () => {
    this.resetMenu()
    AuroraIController.hidenFeatureView(true)
  }

  onTouchMsgList = () => {
    AuroraIController.hidenFeatureView(true)
  }

  onPullToRefresh = () => {
    console.log("on pull to refresh")
    var messages = []
    for (var i = 0; i < 14; i++) {
      var message = constructNormalMessage()
      // if (index%2 == 0) {
      message.msgType = "text"
      message.text = "" + i
      // }

      if (i % 3 == 0) {
        message.msgType = "video"
        message.text = "" + i
        message.mediaPath = "/storage/emulated/0/ScreenRecorder/screenrecorder.20180323101705.mp4"
        message.duration = 12
      }
      messages.push(message)
    }
    AuroraIController.insertMessagesToTop(messages)
    if (Platform.OS === 'android') {
      this.refs["MessageList"].refreshComplete()
    }

  }
// 发送文本消息
  onSendText = async(text) => {
    const message = constructNormalMessage() 
    var evenmessage = constructNormalMessage()
    message.msgType = 'text'
    message.text = text
    if (this.props.UserStore.user.u_usertype == 1) {
      message.fromUser.avatarPath = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.51yuansu.com%2Fpic2%2Fcover%2F00%2F30%2F73%2F58108f4b2a480_610.jpg&refer=http%3A%2F%2Fwww.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg";
    }else{
      message.fromUser.avatarPath = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic2%2Fcover%2F00%2F36%2F49%2F5811d7c48840d_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg";
    }
    AuroraIController.appendMessages([message])
    //极光来实现发送文本
    const name = this.props.route.params.u_id;
    const username = name.toString();
    const extras = {user:JSON.stringify(this.props.UserStore.user)};
    const res = await JMessage.sendTextMessage(username,text,extras)
  }

  onTakePicture = (media) => {
    console.log("media " + JSON.stringify(media))
    var message = constructNormalMessage()
    message.msgType = 'image'
    message.mediaPath = media.mediaPath
    AuroraIController.appendMessages([message])
    this.resetMenu()
    AuroraIController.scrollToBottom(true)
  }

  onStartRecordVoice = (e) => {
    console.log("on start record voice")
  }

  onFinishRecordVoice = (mediaPath, duration) => {
    var message = constructNormalMessage()
    message.msgType = "voice"
    message.mediaPath = mediaPath
    message.timeString = "21:51"
    message.duration = duration
    AuroraIController.appendMessages([message])
    console.log("on finish record voice")
  }

  onCancelRecordVoice = () => {
    console.log("on cancel record voice")
  }

  onStartRecordVideo = () => {
    console.log("on start record video")
  }

  onFinishRecordVideo = (video) => {
    // var message = constructNormalMessage()

    // message.msgType = "video"
    // message.mediaPath = video.mediaPath
    // message.duration = video.duration
    // AuroraIController.appendMessages([message])
  }

  onSendGalleryFiles = (mediaFiles) => {
    /**
     * WARN: This callback will return original image, 
     * if insert it directly will high memory usage and blocking UI。
     * You should crop the picture before insert to messageList。
     * 
     * WARN: 这里返回的是原图，直接插入大会话列表会很大且耗内存.
     * 应该做裁剪操作后再插入到 messageListView 中，
     * 一般的 IM SDK 会提供裁剪操作，或者开发者手动进行裁剪。
     * 
     * 代码用例不做裁剪操作。
     */
    // Alert.alert('fas', JSON.stringify(mediaFiles))
    console.log(mediaFiles);
    mediaFiles.forEach( async v =>{
      //创建一个消息对象
      const message = constructNormalMessage()
      // 判断当前文件类型
        if (v.mediaType == "image") {
          message.msgType = "image"
        } else {
          message.msgType = "video"
          message.duration = v.duration
        }
  
        message.mediaPath = v.mediaPath
        // message.timeString = "8:00"
        message.status = "send_going"
        AuroraIController.appendMessages([message])
        AuroraIController.scrollToBottom(true)

        // 调用极光的发送图片方法
        const name = this.props.route.params.u_id;
        const username = name.toString();
        const path = v.mediaPath;
        const extras = {user:JSON.stringify(this.props.UserStore.user)} ;
        const res = await JMessage.sendImageMessage(username,path,extras);
        console.log("=============");
        console.log(res);
        console.log("=============");
        
        //修改消息状态
        AuroraIController.updateMessage({...message,status:"send_succeed"});
    })
    // for (index in mediaFiles) {
    //   var message = constructNormalMessage()
    //   if (mediaFiles[index].mediaType == "image") {
    //     message.msgType = "image"
    //   } else {
    //     message.msgType = "video"
    //     message.duration = mediaFiles[index].duration
    //   }
    //   message.mediaPath = mediaFiles[index].mediaPath
    //   // message.timeString = "8:00"
    //   message.status = "send_going"
    //   AuroraIController.appendMessages([message])
    //   AuroraIController.scrollToBottom(true)
    // }

    this.resetMenu()
  }

  onSwitchToMicrophoneMode = () => {
    AuroraIController.scrollToBottom(true)
  }

  onSwitchToEmojiMode = () => {
    AuroraIController.scrollToBottom(true)
  }
  onSwitchToGalleryMode = () => {
    AuroraIController.scrollToBottom(true)
  }

  onSwitchToCameraMode = () => {
    AuroraIController.scrollToBottom(true)
  }

  onShowKeyboard = (keyboard_height) => {
  }

  updateLayout(layout) {
    this.setState({ inputViewLayout: layout })
  }

  onInitPress() {
    console.log('on click init push ');
    this.updateAction();
  }

  onClickSelectAlbum = () => {
    console.log("on click select album")
  }

  onCloseCamera = () => {
    console.log("On close camera event")
    this.setState({
      inputLayoutHeight: 100,
      messageListLayout: { flex: 1, width: window.width, margin: 0 },
      inputViewLayout: { flex: 0, width: window.width, height: 100 },
      navigationBar: { height: 64, justifyContent: 'center' }
    })
  }

  /**
   * Switch to record video mode or not
   */
  switchCameraMode = (isRecordVideoMode) => {
    console.log("Switching camera mode: isRecordVideoMode: " + isRecordVideoMode)
    // If record video mode, then set to full screen.
    if (isRecordVideoMode) {
      this.setState({
        messageListLayout: { flex: 0, width: 0, height: 0 },
        inputViewLayout: { flex: 1, width: window.width, height: window.height },
        navigationBar: { height: 0 }
      })
    } 
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={this.state.navigationBar}
          ref="NavigatorView">
            <View style={{alignItems:"center",padding:10,flexDirection:"row"}}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                  <SvgUri svgXmlData={goBack} height="30" width="30"/>
              </TouchableOpacity>
              <View style={{justifyContent:"center",alignItems:"center",width:"83%"}}>
                <Text style={{fontSize:15,color:"#111"}}>{this.props.route.params.u_realname}</Text>
              </View>
            </View>
          {/* <Button
            style={styles.sendCustomBtn}
            title={this.props.route.params.u_realname}
            onPress={() => {
              if (Platform.OS === 'ios') {
                var message = constructNormalMessage()
                message.msgType = 'custom'
                message.content = `
                <h5>This is a custom message. </h5>
                <img src="file://${RNFS.MainBundlePath}/default_header.png"/>
                `
                console.log(message.content)
                message.contentSize = { 'height': 100, 'width': 200 }
                message.extras = { "extras": "fdfsf" }
                AuroraIController.appendMessages([message])
                AuroraIController.scrollToBottom(true)
              } else {
                var message = constructNormalMessage()
                message.msgType = "custom"
                message.msgId = "10"
                message.status = "send_going"
                message.isOutgoing = true
                message.content = `
                <body bgcolor="#ff3399">
                  <h5>This is a custom message. </h5>
                  <img src="/storage/emulated/0/XhsEmoticonsKeyboard/Emoticons/wxemoticons/icon_040_cover.png"></img>
                </body>`
                message.contentSize = { 'height': 100, 'width': 200 }
                message.extras = { "extras": "fdfsf" }
                var user = {
                  userId: "1",
                  displayName: "",
                  avatarPath: ""
                }
                user.displayName = "0001"
                user.avatarPath = "ironman"
                message.fromUser = user
                AuroraIController.appendMessages([message]);
              }
            }}>
          </Button> */}
        </View>
        <MessageListView style={this.state.messageListLayout}
          ref="MessageList"
          isAllowPullToRefresh={true}
          onAvatarClick={this.onAvatarClick}
          onMsgClick={this.onMsgClick}
          onStatusViewClick={this.onStatusViewClick}
          onTouchMsgList={this.onTouchMsgList}
          onTapMessageCell={this.onTapMessageCell}
          onBeginDragMessageList={this.onBeginDragMessageList}
          onPullToRefresh={this.onPullToRefresh}
          avatarSize={{ width: 50, height: 50 }}
          avatarCornerRadius={25}
          messageListBackgroundColor={"#f3f3f3"}
          sendBubbleTextSize={18}
          sendBubbleTextColor={"#000000"}
          sendBubblePadding={{ left: 10, top: 10, right: 15, bottom: 10 }}
          datePadding={{ left: 5, top: 5, right: 5, bottom: 5 }}
          dateBackgroundColor={"#F3F3F3"}
          photoMessageRadius={5}
          maxBubbleWidth={0.7}
          videoDurationTextColor={"#ffffff"}
          dateTextColor="#666666"
        />
        <InputView style={this.state.inputViewLayout}
          ref="ChatInput"
          onSendText={this.onSendText}
          onTakePicture={this.onTakePicture}
          onStartRecordVoice={this.onStartRecordVoice}
          onFinishRecordVoice={this.onFinishRecordVoice}
          onCancelRecordVoice={this.onCancelRecordVoice}
          onStartRecordVideo={this.onStartRecordVideo}
          onFinishRecordVideo={this.onFinishRecordVideo}
          onSendGalleryFiles={this.onSendGalleryFiles}
          onSwitchToEmojiMode={this.onSwitchToEmojiMode}
          onSwitchToMicrophoneMode={this.onSwitchToMicrophoneMode}
          onSwitchToGalleryMode={this.onSwitchToGalleryMode}
          onSwitchToCameraMode={this.onSwitchToCameraMode}
          onShowKeyboard={this.onShowKeyboard}
          onTouchEditText={this.onTouchEditText}
          onFullScreen={this.onFullScreen}
          onRecoverScreen={this.onRecoverScreen}
          onSizeChange={this.onInputViewSizeChange}
          closeCamera={this.onCloseCamera}
          switchCameraMode={this.switchCameraMode}
          showSelectAlbumBtn={true}
          showRecordVideoBtn={false}
          onClickSelectAlbum={this.onClickSelectAlbum}
          inputPadding={{ left: 30, top: 10, right: 10, bottom: 10 }}
          galleryScale={0.6}//default = 0.5
          compressionQuality={0.6}
          cameraQuality={0.7}//default = 0.5
          customLayoutItems={{
            left: [],
            right: ['send'],
            bottom: ['voice','gallery','emoji','camera']
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendCustomBtn: {

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputView: {
    backgroundColor: 'green',
    width: window.width,
    height: 100,
  },
  btnStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3e83d7',
    borderRadius: 8,
    backgroundColor: '#3e83d7'
  }
});
export default  TestRNIMUI