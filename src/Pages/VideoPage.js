import React, { Component } from 'react'
import { 
    Text,
    View , 
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image
} from 'react-native'
import Feather from "react-native-vector-icons/Feather" ;
import AntDesign from "react-native-vector-icons/AntDesign" ;
import {ImageHeaderScrollView} from 'react-native-image-header-scroll-view';
import request from "../utils/request";
import { SUBJECT_CHINESE,SUBJECT_ENGLISH,SUBJECT_MATH,VIDEO_VIEWNUM,VIDEO_FINDBYSUB } from "../utils/pathMap";
//视频播放组件
import Slider from 'react-native-slider';
import Video from 'react-native-video';
import { FlatList } from 'react-native';
import { Button } from 'react-native';
import { Alert } from 'react-native';
import TopNav from "../components/TopNav";
import Toast from '../utils/Toast';
import { inject, observer } from 'mobx-react';

@observer
@inject("RootStore")
export default class ClassPage extends Component {
    constructor(props){
        super(props);
        this.state={
            isPaused: true,
            duration: 0,
            currentTime:0,
            sliderValue:0,
            videoHeight:225,
            isVisiblePausedSliderFullScreen: false,
            courseId:this.props.route.params.c_id,
            subject:this.props.route.params.c_subject,
            viewNum:this.props.route.params.c_view,
            c_url:"",
            c_pic:"",
            c_name:"",
            getVideo:[],
            isCollect:false
        }
    }
    componentDidMount(){
        this.getCourses()
    }
    changePausedState=async()=>{ //控制按钮显示播放，要显示进度条3秒钟，之后关闭显示
        await request.get(VIDEO_VIEWNUM+this.state.courseId)
        this.setState({
            isPaused: this.state.isPaused?false:true,
            isVisiblePausedSliderFullScreen: true
        })
        //这个定时调用失去了this指向
        let that = this;
        setTimeout(function(){
            that.setState({
                isVisiblePausedSliderFullScreen: false
            })
        },5000)
    }
  
     //格式化音乐播放的时间为0：00。借助onProgress的定时器调用，更新当前时间
    formatMediaTime=(time)=> {
      let minute = Math.floor(time / 60);
      let second = parseInt(time - minute * 60);
      minute = minute >= 10 ? minute : "0" + minute;
      second = second >= 10 ? second : "0" + second;
      return minute + ":" + second;
    }
  
    //加载视频调用，主要是拿到 “总时间”，并格式化
    customerOnload=(e)=>{
      let time = e.duration;   
      this.setState({
          duration: time
      })
    }
    // 获得当前的，播放时间数，但这个数是0.104，需要处理
    customerOnprogress=(e)=>{
      let time = e.currentTime;   // 获取播放视频的秒数       
      this.setState({
          currentTime: time,
          sliderValue: time
      })           
    }
    
    // 移动滑块，改变视频播放进度
    customerSliderValue=(value)=>{  
      this.player.seek(value);    
    }
  
    _changePauseSliderFullState=()=>{ // 单击事件，是否显示 “暂停、进度条、全屏按钮 盒子”
      let flag = this.state.isVisiblePausedSliderFullScreen?false:true; 
      this.setState({
          isVisiblePausedSliderFullScreen: flag
      })
       //这个定时调用失去了this指向
       let that = this;
       setTimeout(function(){
           that.setState({
               isVisiblePausedSliderFullScreen: false
           })
       },5000)
  } 
    //请求课程数据
      getCourses=async()=>{
          const {courseId,subject} = this.state
          console.log(courseId,subject);
          if(subject == "语文"){
            const res = await request.get(SUBJECT_CHINESE+courseId)
            this.setState({ 
              c_url : res.data.c_url,
              c_pic : res.data.c_pic,
              c_name : res.data.c_name
             });
            // console.log(res);
          }else if(subject == "数学"){
            const res = await request.get(SUBJECT_MATH+courseId)
            this.setState({ 
              c_url : res.data.c_url,
              c_pic : res.data.c_pic,
              c_name : res.data.c_name
             });
          }else{
            const res = await request.get(SUBJECT_ENGLISH+courseId)
            this.setState({ 
              c_url : res.data.c_url,
              c_pic : res.data.c_pic,
              c_name : res.data.c_name
             });
          }
          const findSubject = await request.get(VIDEO_FINDBYSUB+subject)
          this.setState({ getVideo:findSubject  });
          console.log(findSubject);
      }
        // 渲染播放按钮组件：是否显示
       playButtonComponent=()=>{
           return(
            <TouchableWithoutFeedback
                onPress={this.changePausedState}
            >
                <View style={styles.playBtn}> 
                    <Text>▶</Text>                      
                </View> 
            </TouchableWithoutFeedback>
           )
       }

    pausedSliderFullComponent=()=>{
        let Btn = this.state.isPaused?<Feather name="play-circle" size={28} color="gray"/> :<Feather name="pause-circle" size={28} color="gray"/>  ;
        return(
            <View style={{position:"absolute",bottom:0}}>
                <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
                    <View style={styles.gobackBtn}>
                        <Feather name="chevron-left" size={30} color="gray"/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(211,211,211,0.6)'}}>
                    {/* 进度条按钮 */}
                    <View style={styles.sliderBox}>
                        {/* 播放暂停按键 */}
                        <TouchableWithoutFeedback 
                            onPress={()=>this.setState({isPaused: this.state.isPaused?false:true })}
                        >
                            <View style={{marginLeft:6}}>{Btn}</View>   
                        </TouchableWithoutFeedback>
                        {/* 播放按键 结束 */}
                        <Text style={{color:"#555",marginLeft:5}}>{this.formatMediaTime(this.state.currentTime)}</Text>
                        <Slider 
                            style={{width: 160, height: 40}} 
                            value={this.state.sliderValue}
                            maximumValue={this.state.duration}
                            thumbTintColor="#eee" 
                            thumbTouchSize={{width:10,height:10}}          
                            minimumTrackTintColor="red"
                            maximumTrackTintColor="#ccc"
                            step={1}
                            onValueChange={this.customerSliderValue}
                        />
                        <Text style={{color:"#555",margin:10}}>{this.formatMediaTime(this.state.duration)}</Text>
                    </View>
                    {/* 全屏按钮 */}
                </View>   
            </View>
        )
    }
    headBar=()=>{
        return(
            // <TouchableOpacity style={{width:20,height:20}} onPress={()=>Alert.alert("Press")}>
            // <Feather name="chevron-left" size={30} color="gray"/>
            // </TouchableOpacity>
            <TopNav/>
        )
    }
    collect=()=>{
        const {isCollect} = this.state
        if(!this.props.RootStore.loginstat){
            Toast.sad("请先登录",1000,"center")
            return;
        }
        this.setState({ isCollect:!isCollect });
        if(!isCollect){
            Toast.message("已收藏",1000,"bottom")
        }else{
            Toast.message("取消收藏",1000,"bottom")
        }
    }

    render() {
        const {viewNum,c_url,c_name,getVideo} = this.state
        let pausedBtn = this.state.isPaused?this.playButtonComponent():null;
        let pausedSliderFull = this.state.isVisiblePausedSliderFullScreen?this.pausedSliderFullComponent():null;
        let collectBtn = this.state.isCollect? <AntDesign name="star" size={30} style={{color:"gold"}}  />:<AntDesign name="star" size={30} style={{color:"gray"}}  />
        const poster ="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg0.pconline.com.cn%2Fpconline%2F1405%2F04%2F4715879_img_8395_thumb.jpg&refer=http%3A%2F%2Fimg0.pconline.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613032721&t=655e128b65e12a5d108d9ae143f381a5";
        return (
            <View style={styles.container}>
                <ImageHeaderScrollView
                    maxHeight={225}
                    minHeight={60}
                    // headerImage={require("../pic/Minepage2.png")}
                    renderHeader={this.headBar}
                    renderForeground={() => (
                        <View>
                            {/* 视频播放 开始 */}
                            <View >
                                <View style={{justifyContent:"center",alignContent:"center"}}>
                                    <TouchableWithoutFeedback
                                        onPress={this._changePauseSliderFullState}
                                        onResponderMove={this._onStartShouldSetResponder}
                                    >
                                    <Video source={{uri: c_url}}   // Can be a URL or a local file.
                                        ref={(ref) => {
                                        this.player = ref
                                        }}                                      // Store reference
                                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                        onError={this.videoError}               // Callback when video cannot be loaded
                                        style={{width:this.state.videoWidth,height:this.state.videoHeight}} 
                                        paused = {this.state.isPaused} // 控制视频是否播放
                                        onLoad={(e)=>this.customerOnload(e)} 
                                        onProgress={(e)=>this.customerOnprogress(e)}   
                                        resizeMode="stretch" 
                                        poster={poster}
                                        posterResizeMode="cover"
                                    />
                                    </TouchableWithoutFeedback>
                                    {/* 播放的按钮：点击之后需要消失 */}
                                        {pausedBtn}
                                    {/* 暂停按钮，进度条，全屏按钮 */}
                                        {pausedSliderFull}
                                </View>
                            </View> 
                            {/* 视频 结束 */}
                        </View>
                    )}
                >
                    <View style={{ height: 600 }}>
                        <View style={styles.CourseInfo}>
                            <Text style={{fontSize:16,fontWeight:"bold",marginTop:10,flex:8}}>{c_name}</Text>
                            <Text style={{width:20}}></Text>
                            <TouchableOpacity 
                                style={{marginTop:20}}
                                onPress={this.collect}
                                >
                                {collectBtn}
                                <Text style={{fontSize:10,color:"gray",marginTop:0,marginLeft:4,flex:2}}>收藏</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginLeft:15,marginTop:-20,height:40}}>
                            <Text style={{fontSize:10,color:"gray",marginTop:10}}>{viewNum} 浏览</Text>
                        </View>
                        {/* 分割线 */}
                        <View style={{backgroundColor:"#eee",height:10}}></View>
                        {/* 其他课程  */}
                        <View style={styles.otherCourse}>
                            <Text style={{fontSize:16,fontWeight:"bold"}}>其他课程</Text>
                            <ScrollView 
                                horizontal={true}
                            >
                                {getVideo.map((v,i)=><View key={i} style={{alignItems:"center"}}>
                                <TouchableOpacity style={styles.coursesBox} 
                                    onPress={()=>{
                                        this.setState({
                                        courseId : v.c_id,
                                        subject : v.c_subject,
                                        viewNum : v.c_view,
                                        c_url: v.c_url,
                                        c_name: v.c_name
                                        })
                                    }}>
                                    <Image 
                                        source={{uri:v.c_pic}} 
                                        style={{width:120,height:80,borderRadius:15}}
                                    />
                                    <Text style={{fontSize:10}}>{v.c_name.slice(0,8)}...</Text>
                                    </TouchableOpacity>
                                    
                                </View>)}
                            </ScrollView>
                        </View>
                        <View style={{backgroundColor:"#eee",height:10}}></View>
                        {/* 其他课程 结束 */}
                        <View style={{padding:10}}>
                            <Text style={{fontSize:16,fontWeight:"bold"}}>评论</Text>
                        </View>
                        <FlatList

                        />
                    </View>
                </ImageHeaderScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    myVideo:{
        width: 340,
        height: 240
    },
    playBtn:{
        width: 50,
        height: 50,
        backgroundColor:'rgba(211,211,211,0.6)',
        borderRadius: 50,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -25,
        marginTop:-25,
        zIndex:999,
        justifyContent:"center",
        alignItems:"center"
    },
    pauseBtn:{
        width: 50,
        height: 50,
        backgroundColor:'rgba(211,211,211,0.6)',
        borderRadius: 50,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -25,
        marginTop:-25,
        zIndex:999,
        justifyContent:"center",
        alignItems:"center"
    },
    gobackBtn:{
        width: 50,
        height: 180,
    },
    sliderBox:{
        flex:0,
        flexDirection:'row',
        alignItems:'center',
        color:"#eee",
        opacity:1,
        width:"100%"
    },
    backgroundVideo: {
        // width:screenWidth,
        position: 'absolute',
        top: 100,
        left: 0,
        bottom: 0,
        right: 0,
    },
    CourseInfo:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:10,
        marginTop:-10,
        height:90
    },
    otherCourse:{
        height:160,
        padding:10
    },
    coursesBox:{
        width:100,
        height:130,
        marginTop:10,
        marginRight:26
    }
})
