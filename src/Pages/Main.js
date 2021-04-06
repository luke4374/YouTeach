import React, { Component } from 'react'
import { 
  Text, 
  View,
  StyleSheet,
  Dimensions, 
  ScrollView, 
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl
} from 'react-native';
import { NavigationContext } from '@react-navigation/native';
import {ImageHeaderScrollView} from 'react-native-image-header-scroll-view';
import { createStackNavigator } from '@react-navigation/stack';
import { BASE_URI,MAIN_FINDCOURSE,MAIN_COURSENUM } from "../utils/pathMap";
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchBar,Header } from 'react-native-elements';
import SvgUri from "react-native-svg-uri";
import Toast from "../utils/Toast";
import { 
  Chinese,
  English,
  Math,
  Test
} from "../res/fonts/iconSg";
//import SplashScreen from 'react-native-splash-screen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons" ;
import Nav from "./nav";
import CustomModal from "../utils/CustomModal";
import axios from "axios";
import RootStore from "../mobx";
//全局数据引入 inject=>注入
import { inject,observer } from "mobx-react";

@inject("RootStore","UserStore")
// @observer
export default class Main extends Component {
  static contextType = NavigationContext;
    state={
        // isRefreshing:true,//下拉刷新标记
        // isLoading:false,//上拉加载
        refreshing:false,
        page:1,
        totalPage:0,
        modalVisibility:true,
        search:"",
        Courses:[],
        random:10,
        grade:""
      }

      componentDidMount(){
        this.getTotalPage();
        // console.log("++++++++++++++++++");
        // console.log(this.props);
        this.getCourses();
      }
      //获取视频信息
      getCourses=(type = 1)=>{
        this.setState({ refreshing:true  });
        fetch(BASE_URI+MAIN_FINDCOURSE+this.state.page)
        .then(res=>res.json())
        .then(res=>{
          // console.log(res);
          let list = this.state.Courses;
          if(type == 2){
            list = list.concat(res);
            Toast.message("加载中..",1000,"bottom")
          }else{
            list = res.concat(list);
          }
          this.setState({ 
            Courses: list,
            page:this.state.page+1,
            refreshing:false
          });
        })
        .catch((error)=>{
          console.error(error);
        })
      }

      getTotalPage=()=>{
        fetch(BASE_URI+MAIN_COURSENUM)
        .then(res=>res.json())
        .then(res=>{
          this.setState({ totalPage : (res/6) + 1  });
        })
        
      }
      // 登陆提醒 开始
      LeftPress=()=>{
        this.setState({ modalVisibility:false  });
      }
      RightPress=()=>{
        this.props.navigation.navigate('Login')
        this.setState({ modalVisibility:false  });
      }
      // 登陆提醒 结束 

      //搜索框事件
      updateSearch = (search) => {
        this.setState({ search });
      };
      //渲染Flatlist
      renderItem=({item})=>{
        return(
          
          <TouchableOpacity style={styles.coursesBox} key={item.u_id} 
            onPress={()=>this.props.navigation.navigate('Video',{
              c_id:item.c_id,
              c_subject:item.c_subject,
              c_view:item.c_view
            })}>
            <View style={{flex:2 }}>
              <Image 
                style={styles.Image}
                source={{uri:item.c_pic}}
              />
            </View>
            <View style={{flex:1,marginTop:-20,padding:10}}>
              <Text style={styles.courseInfo}>{item.c_name.slice(0,24)}...</Text>
            </View>
            {/* 左下角信息 */}
            <View style={styles.leftcorner}>
                <Text style={{fontSize:10,color:"#777"}}>▶ { item.c_view }</Text>
            </View>
          </TouchableOpacity>
        )
      }
        //  科目图标 开始 
      renderLiveBtn=()=>{
        return(
              <View>
                <Text style={{margin:10,fontSize:16,fontWeight:"bold",color:"#555"}}>直播课程入口</Text>
                <View style={styles.icons}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate("LiveCourse",{title:"语文"})}>
                    <SvgUri svgXmlData={Chinese} width="49" height="49" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate("LiveCourse",{title:"数学"})}>
                    <SvgUri svgXmlData={Math} width="49" height="49" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate("LiveCourse",{title:"英语"})}>
                    <SvgUri svgXmlData={English} width="49" height="49" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.context.navigate("发现")}>
                    <SvgUri svgXmlData={Test} width="44" height="44" />
                  </TouchableOpacity>
                </View>
                <View style={styles.iconsText}>
                  <Text style={{fontSize:13, color:"#666"}}>语文</Text>
                  <Text style={{fontSize:13, color:"#666"}}>数学</Text>
                  <Text style={{fontSize:13, color:"#666"}}>英语</Text>
                  <Text style={{fontSize:13, color:"#666"}}>测试</Text>
                </View>
                <Text style={{margin:10,fontSize:16,fontWeight:"bold",color:"#555"}}>在线视频课程</Text>
              </View>
        )
      }
    render() {  
      const {LoginStat,search,Courses,refreshing} = this.state
        return (

          <View style={styles.container}>
            
              <View>
            {/* 若不是登陆状态 则显示弹窗 */}
            {this.props.RootStore.loginstat? <View></View> : <CustomModal title="啊哦~" message="您还未登录，是否前往登录"  ref="_customModal" visibility={this.state.modalVisibility}
                     onLeftPress={this.LeftPress} onRightPress={this.RightPress}/>}
              </View>
            {/* 弹窗 结束 */}
              {/* 搜索框 开始 */}
               <View style={{flexDirection:"row",padding:7}}>
                 <TouchableOpacity style={{justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                    <Text style={{color:"#555"}}>年级</Text>
                    <MaterialCommunityIcons name="unfold-more-horizontal" size={16} color="#555"/>
                 </TouchableOpacity>
                  <SearchBar
                    lightTheme round
                    containerStyle={styles.searchBoxContainer}
                    inputContainerStyle={styles.searchBox}
                    inputStyle={styles.input}
                    placeholder="请输入..."
                    onChangeText={this.updateSearch}
                    value={search}
                  />
               </View>
              {/* 搜索框 结束 */}

          <View style={{height:472}}>
            {/* <Text>在线视频</Text> */}
            {/* FlatList 开始 */}
            <FlatList
                ListHeaderComponent={this.renderLiveBtn}
                keyExtractor={(item,index)=>index.toString()}                
                refreshing={refreshing}
                onRefresh={()=>this.getCourses()}
                onEndReached={()=>this.getCourses(2)}
                numColumns={2}
                columnWrapperStyle={styles.listView}
                data={Courses}
                renderItem={this.renderItem}
                onEndReachedThreshold={1}
               />
               </View>
            {/* FlatList 结束 */}
          </View>

        )
    }
}
const styles = StyleSheet.create({
  container:{
    // flex:1,
    //FEFEFE F8F8F8
    backgroundColor:"#E1E6ED"
  },
  searchbar:{
    height:70
  },
  searchBoxContainer:{
    // backgroundColor:"lightgray",
    borderWidth:0
  },
  searchBox:{
    // backgroundColor:"#333",
    borderRadius:50,
    height:30,
    width:250,
    alignSelf:'center'
  },
  input:{
    fontSize:15,
    marginTop:5
  },
  icons:{
    marginTop:10,
    width:"85%",
    flexDirection:"row",
    alignSelf:'center',
    justifyContent:'space-between'
  },
  iconsText:{
    width:"80%",
    flexDirection:"row",
    alignSelf:'center',
    justifyContent:'space-between'
  },
  listView:{
    //主轴方向
    flexDirection:'row',
    justifyContent:'space-around',
    //显示不下换行显示
    flexWrap:'wrap',
    // 侧轴方向
    alignItems:'center',
    padding:4
  },
  coursesBox:{
    margin:3,
    flex:1,
    backgroundColor:"#fff",
    width:150,
    height:160,
    borderRadius:15
  },
  Image:{
    width:"100%",
    height:85,
    borderTopLeftRadius:15,
    borderTopRightRadius:15
  },
  courseInfo:{
    fontSize:11,
    fontWeight:"bold",
    color:"black",
  },
  leftcorner:{
   marginLeft:8,
   marginTop:-15,
   paddingBottom:10
  }
})