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
import Entypo from "react-native-vector-icons/Entypo" ;
import {ImageHeaderScrollView} from 'react-native-image-header-scroll-view';
import request from "../utils/request";
import SvgUri from "react-native-svg-uri";
import { GirlIcon,BoyIcon} from "../res/fonts/iconSg";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { FIND_BY_CID,VIDEO_VIEWNUM,VIDEO_FINDBYSUB,FIND_COMMENT,UPDATE_COMMENT,
        FIND_COLLECTION,ADD_COLLECTION, DELE_Video_COLL_BYCUID} from "../utils/pathMap";
//视频播放组件
import Slider from 'react-native-slider';
import Video from 'react-native-video';
import { FlatList } from 'react-native';
import { Alert } from 'react-native';
import Toast from '../utils/Toast';
import { inject, observer } from 'mobx-react';
const input = React.createRef();

@observer
@inject("RootStore","UserStore")
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
            isCollect:false,
            search:"",
            comments:[],
            myComment:"",
            refreshing:false,
            commIsNull:false
        }
    }
    componentDidMount(){
        this.getCourses()
        if(this.props.RootStore.loginstat){
            this.requestCollection()
        }else{
            return;
        }
        console.log(this.props)
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
          const {courseId,subject,comments,c_name} = this.state
          console.log(courseId,subject);
          const res = await request.get(FIND_BY_CID+courseId)
          const comm = await request.get(FIND_COMMENT+courseId)
          this.setState({ 
            c_url : res.c_url,
            c_pic : res.c_pic,
            c_name : res.c_name,
            viewNum: res.c_view,
            comments : comm
           });
           if (comm.length!=0) {
               this.setState({ commIsNull: true });
           }else if(comm==null){
               this.setState({ commIsNull: false });
           }
           console.log(comm);
           console.log("-----------------------");
           console.log(res.c_name);
           console.log(this.state.commIsNull)
          const findSubject = await request.get(VIDEO_FINDBYSUB+subject)
          this.setState({ getVideo:findSubject });
        //   console.log(findSubject);
      }
      //评论上传
      submitComment=async()=>{
        const {courseId,myComment} = this.state;
        if(!this.props.RootStore.loginstat){
            Toast.sad("请先登录",1000,"center")
            return;
        }
        if(myComment != ""){
            const onsubmit = await request.post(UPDATE_COMMENT,{
            c_id:courseId,
            u_id:this.props.UserStore.user.u_id,
            a_content:myComment
        })
            console.log(this.props.RootStore.userId);
            if(onsubmit.status == 1){
                Toast.message("评论成功",1000,"bottom")
            }
            this.getCourses();
            this.setState({ myComment:"" })
            input.current.clear();
        }else{
            Toast.message("评论不能为空",1000,"bottom")
        }


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
            let Btn = this.state.isPaused?<Entypo name="controller-play" size={25} color="#FFFFFF"/> :<Entypo name="controller-paus" size={25} color="#FFFFFF"/>  ;
            return(
                <View style={{position:"absolute",bottom:0}}>
                    <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
                        <View style={styles.gobackBtn}>
                            <Feather name="chevron-left" size={30} color="#FFFFFF"/>
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
                            <Text style={{color:"#444",margin:10}}>{this.formatMediaTime(this.state.currentTime)}</Text>
                            <Slider 
                                style={{width: 160, height: 20}} 
                                thumbStyle={{width:15,height:15}}
                                value={this.state.sliderValue}
                                maximumValue={this.state.duration}
                                thumbTintColor="#eee" 
                                thumbTouchSize={{width:10,height:10}}          
                                minimumTrackTintColor="#FFF"
                                maximumTrackTintColor="#C0C0C0"
                                step={1}
                                onValueChange={this.customerSliderValue}
                            />
                            <Text style={{color:"#444",margin:10}}>{this.formatMediaTime(this.state.duration)}</Text>
                        </View>
                        {/* 全屏按钮 */}
                    </View>   
                </View>
            )
        }
    headBar=()=>{
        return(
            <TouchableOpacity style={{position:"absolute",marginTop:10,width:20,height:20}} onPress={()=>Alert.alert("Press")}>
                <Feather name="chevron-left" size={30} color="gray"/>
            </TouchableOpacity>
            // <TopNav style={{position:"absolute"}}/>
        )
    }
    requestCollection=async()=>{
        const {courseId} = this.state
        const res = await request.get(FIND_COLLECTION+this.props.UserStore.user.u_id+"/"+courseId);
        if(res.data != null){
            this.setState({ isCollect:true  });
        }
        console.log("------------------查找收藏-------------------");
        console.log(res);

    }
    //收藏按钮点击事件
    collect=async()=>{
        const {isCollect,courseId} = this.state
        if(!this.props.RootStore.loginstat){
            Toast.sad("请先登录",1000,"center")
            return;
        }
        this.setState({ isCollect:!isCollect });
        if(!isCollect){
            const res = await request.get(ADD_COLLECTION+this.props.UserStore.user.u_id+"/"+courseId+"/"+'1');
            console.log(res);
            Toast.message("已收藏",1000,"bottom")
        }else{
            const res = await request.delete(DELE_Video_COLL_BYCUID+courseId+"/"+this.props.UserStore.user.u_id);
            console.log(res);
            Toast.message("取消收藏",1000,"bottom")
        }
    }

    renderComments=({item})=>{
        const {comments} = this.state
        let pic = null;
        if (item.u_gender == "男") {
            pic = <View>
                <SvgUri svgXmlData={BoyIcon} width="45" height="45" />
            </View>
        }else{
            pic = <View>
                <SvgUri svgXmlData={GirlIcon} width="45" height="45" />
            </View>
        }
        if(comments.length!=0){
            return(
                <View style={{height:100}}>
                    <View style={{flexDirection:"row",height:"99%",padding:8}}>
                        {pic}
                        <View style={{marginLeft:6}}>
                            <Text style={{fontSize:12,color:"black"}}>{item.u_nickname}</Text>
                            <Text style={{fontSize:12,color:"gray"}}>{item.u_grade}</Text>
                            <Text style={{marginTop:15}}>{item.a_content}</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:"lightgray",height:1}}></View>
                </View>
            )

        }    
    }
    commentChange=(myComment)=>{
        this.setState({ myComment });
        console.log(myComment)
    }

    render() {
        const {viewNum,c_url,c_name,getVideo,myComment,comments,refreshing,commIsNull} = this.state
        let pausedBtn = this.state.isPaused?this.playButtonComponent():null;
        let pausedSliderFull = this.state.isVisiblePausedSliderFullScreen?this.pausedSliderFullComponent():null;
        let collectBtn = this.state.isCollect? <AntDesign name="star" size={30} style={{color:"gold"}}  />:<AntDesign name="star" size={30} style={{color:"gray"}}  />
        const poster ="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg0.pconline.com.cn%2Fpconline%2F1405%2F04%2F4715879_img_8395_thumb.jpg&refer=http%3A%2F%2Fimg0.pconline.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613032721&t=655e128b65e12a5d108d9ae143f381a5";
        return (
            <View style={styles.container}>
                <ImageHeaderScrollView
                    maxHeight={225}
                    minHeight={50}
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
                        <View style={{marginLeft:10,marginTop:-20,height:40}}>
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
                        {commIsNull?
                            <FlatList
                                keyExtractor={(item,index)=>index.toString()}
                                refreshing={refreshing}
                                // onRefresh={()=>this.getAbilityInfo()}
                                // onEndReached={()=>this.getAbilityInfo(2)}
                                data={comments}
                                renderItem={this.renderComments}
                                onEndReachedThreshold={0.3}
                            />:                
                            <View style={{justifyContent:"center",alignItems:"center",height:"32%"}}>
                                <Text style={{color:"#C0C0C0"}}>评论区空空如也~</Text>
                            </View>
                        }
                         {/* 评论输入框 */}
                         <View style={styles.comment}>
                            <Input
                                ref={input}
                                placeholder="留下你的评论吧~"
                                leftIcon={{ type: 'font-awesome', name: 'comment' , size:20, marginTop:20,color:"gray"}}
                                style={{fontSize:12,marginTop:25,}}
                                onChangeText={this.commentChange}
                                onSubmitEditing={this.submitComment}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={this.submitComment}>
                                <Text style={{color:"#F8F8FF",fontWeight:"bold"}}>发送</Text>
                            </TouchableOpacity>
                         </View>

                    </View>
                </ImageHeaderScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        position:"relative"
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
        position:"absolute",
        width: 50,
        top:-180,
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
        height:100
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
    },
    comment:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"85%",
        height:80
    },
    submitButton:{
        marginTop:45,
        backgroundColor:"#00FA9A",
        width:"15%",
        height:30,
        borderRadius:15,
        justifyContent:"center",
        alignItems:"center"
    }
})
