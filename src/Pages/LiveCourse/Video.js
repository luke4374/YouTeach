import React, { Component,useEffect,useRef,useState, } from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity,PermissionsAndroid,Dimensions,ActivityIndicator } from 'react-native'
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    RtcLocalView,
    RtcRemoteView,
    VideoRemoteState,
    
  } from 'react-native-agora';
import Ionicons from "react-native-vector-icons/Ionicons" ;
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import request from "../../utils/request";
import { Add_Channel } from "../../utils/pathMap";
import { Alert } from 'react-native';
import Toast from "../../utils/Toast";

//获取设备宽度与高度
let dimensions = {
    //get dimensions of the device to use in view styles
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};
//直播状态信息
const videoStateMessage = (state) => {
  switch (state) {
    case VideoRemoteState.Stopped:
      return '直播间已关闭~';

    case VideoRemoteState.Frozen:
      return '连接异常，请重试~';

    case VideoRemoteState.Failed:
      return '网络连接异常！';
  }
};
//获取权限
async function requestCameraAndAudioPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.CAMERA"] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("You can use the cameras & mic");
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
//主函数
export default function Live(props){
    const [peerIds, setPeerIds] = useState([]);
    const [joined, setJoined] = useState(false);
    const [mute, setMute] = useState(false);
    // const [peerIds, setPeerIds] = useState([]);
    const [broadcasterVideoState, setBroadcasterVideoState] = useState(
        VideoRemoteState.Decoding,
      );
    const AgoraEngine = useRef();
    const isBroadcaster = props.route.params.type === "create";
    const isTeacher = props.route.params.Utype == '1';
    // console.log("isTeacher",isTeacher);
    const init=async()=>{
        // 创建实例
        AgoraEngine.current = await RtcEngine.create('5aa231e1761e4d8e82c36eea62153e04');
        AgoraEngine.current.enableVideo();
        AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
        if (isBroadcaster) AgoraEngine.current.setClientRole(ClientRole.Broadcaster);
        //若为用户则静音
        if (!isTeacher) AgoraEngine.current.muteLocalAudioStream(true);

        AgoraEngine.current.addListener('RemoteVideoStateChanged', (uid, state) => {
            if (uid === 1) setBroadcasterVideoState(state);
        });
        
        AgoraEngine.current.addListener('UserJoined', (uid, elapsed) => {
          console.log('UserJoined', uid, elapsed);
          // If new user
          if (peerIds.indexOf(uid) === -1) {
              setPeerIds([...peerIds, uid])
          }
        });
  
        AgoraEngine.current.addListener('UserOffline', (uid, reason) => {
          console.log('UserOffline', uid, reason);
          setPeerIds(peerIds.filter((id) => id !== uid))
        });

        AgoraEngine.current.addListener(
          'JoinChannelSuccess',
          (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess', channel, uid, elapsed);
            setJoined(true);
            setPeerIds(
              [...peerIds,uid]
            );
          },
          );
          
    } 
    console.log("PeerIds:",peerIds);
    const onSwitchCamera = () => AgoraEngine.current.switchCamera();

    useEffect(() => {
      if (Platform.OS === 'android') requestCameraAndAudioPermission();
      const uid = isBroadcaster ? 1 : 0;
      init().then(() =>
        AgoraEngine.current.joinChannel(
          null,
          props.route.params.channel,
          null,
          uid,
        ),
      );
      return () => {
        AgoraEngine.current.destroy();
      };
    }, []);
    
    const renderHost = () =>
    broadcasterVideoState === VideoRemoteState.Decoding ? (
      <RtcRemoteView.SurfaceView
        uid={1}
        style={styles.fullscreen}
        channelId={props.route.params.channel}
      />
    ) : (
      <View style={styles.broadcasterVideoStateMessage}>
        <Text style={styles.broadcasterVideoStateMessageText}>
          {videoStateMessage(broadcasterVideoState)}
        </Text>
      </View>
    );

  const renderLocal = () => (
    <RtcLocalView.SurfaceView
      style={styles.fullscreen}
      channelId={props.route.params.channel}
    />
  );
  const renderStu = () =>{
    return <View style={styles.userGoBack}>
          <View style={styles.showNum}>
            <View>
              <Text style={{color:"#FFF",fontSize:16}}>{`直播间用户：${peerIds.length}`}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={onHangup}>
            <Ionicons name="md-return-up-back" size={20} color="#666" />
          </TouchableOpacity>
    </View>
  }
  const renderTea = () =>{
    return <View style={styles.buttonContainer}>
      <View style={styles.showNum}>
          <View>
            <Text style={{color:"#FFF",fontSize:16}}>{`直播间用户：${peerIds.length}`}</Text>
          </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onMuteHandler}>
        {!mute?<Ionicons name="mic-off" size={30} /> : <Ionicons name="mic" size={30}/>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonHangup} onPress={onHangup} >
        <Material name="phone-hangup" size={30} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSwitchCamera}>
        <Ionicons name="camera-reverse" size={30}/>
      </TouchableOpacity>
    </View>
  }

  const onHangup = async() => {
    Alert.alert("退出直播间","是否退出直播间?",
    [
      {
          text:"取消",
          onPress:()=>Toast.message("已取消",1000,"center"),
          style:"cancel"
      },
      {
          text:"确认",
          onPress:async()=>{
            props.navigation.goBack();
            if(isBroadcaster)
            await request.get(Add_Channel+props.route.params.cid+"/"+'-1');
          }
      }
  ])

  }
  const onMuteHandler = () =>{
    setMute(!mute);
    AgoraEngine.current.muteLocalAudioStream(mute)
    console.log(mute);
    console.log(peerIds);
  }
    return(
        <View style={styles.container}>
            {!joined ? (
                <>
                    <ActivityIndicator
                    size={60}
                    color="#222"
                    style={styles.activityIndicator}
                    />
                    <Text style={styles.loadingText}>加入房间中，请稍等...</Text>
                </>
            ) : (
            // {/ *Live Feed */}
                <>
                    
                    {isBroadcaster ? renderLocal() : renderHost()}
                    {isTeacher ? renderTea() : renderStu() }
                    
                </>
            )}
      </View>
    )
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  fullscreen: {
    width: dimensions.width,
    height: dimensions.height,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: 60,
    height:60,
    backgroundColor: '#fff',
    // opacity:0.8,
    marginBottom: 50,
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent:"center",
    marginHorizontal: 10,
  },
  userGoBack:{
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left:10
  },
  buttonHangup:{
    width: 60,
    height:60,
    backgroundColor: '#DC143C',
    // opacity:0.8,
    marginBottom: 50,
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent:"center",
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 17,
  },
  broadcasterVideoStateMessage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  broadcasterVideoStateMessageText: {
    color: '#fff',
    fontSize: 20,
  },  
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  showNum:{
    // width: 100,
    height:60,
    // backgroundColor: '#fff',
    position:"absolute",
    top:-dimensions.height+130,
    left:150,
    opacity:0.4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent:"center",
  }
});