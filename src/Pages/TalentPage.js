import React, { Component } from 'react'
import {
     Text,
     View,
     FlatList,
     StyleSheet,
     Dimensions,
     ScrollView,
     TouchableOpacity,
     SectionList
} from 'react-native'
import { color } from 'react-native-reanimated';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import request from "../utils/request";
import { 
    BASE_URI,
    ABILITY_INFO,
    TEST_FINDTEST,
    TEST_GETTITLE,
    TEST_NUM
} from "../utils/pathMap";
import SvgUri from 'react-native-svg-uri';
import { Plane,AnswerSheet } from "../res/fonts/iconSg";
import { NavigationContext } from "@react-navigation/native";
 
let screenWidth  = Dimensions.get('window').width;
export default class TalentPage extends Component {
    static contextType = NavigationContext;
    state={
        abilityInfo:[],
        testTitle:[],
        // testNum:0,
        testInfo:[],    
        refreshing:false,
        page:1,
    }

    componentDidMount() {
        this.getAbilityInfo();
        this.getTestInfo();
    }
    //获取能力提升信息
    getAbilityInfo=async(type=1)=>{
        this.setState({ refreshing:true  });
          fetch(BASE_URI+ABILITY_INFO+this.state.page)
          .then(ability=>ability.json())
          
          .then(ability=>{
            console.log("Json:"+ability);
            let list = this.state.abilityInfo;
            if(type == 2){
              //把新加载的数据放在后面
              list = list.concat(ability);
            }else{
              list = ability.concat(list);
            }
            this.setState({ 
              abilityInfo:list,
              page :this.state.page+1,
              refreshing:false
              });
          })
      }

      getTestInfo=async()=>{
        const title = await request.get(TEST_GETTITLE)
        this.setState({ 
            testTitle:title.data,
        });
        console.log("---------------------");
            console.log(this.state.testTitle);
      }
    // 获取测试题数目
    // getTestNum=async(t)=>{
    //     const num =  await request.get(TEST_NUM+t);
    //     return num;
    // }


    //渲染能力提升
    renderAbility=({item})=>{
        const {abilityInfo} = this.state
        return(
            <TouchableOpacity 
                onPress={()=>this.props.navigation.navigate("AbilityInfo",{
                    infoId:item.id,
                    title:item.title
                })}
            >
             <View style={styles.renderAbility}>
                 <Text style={{fontSize:16,fontWeight:"bold"}}>{item.title}</Text>
                 <Text style={{fontSize:10,color:"#444",marginTop:5}}>{item.author}</Text>
                 <Text style={{fontSize:10,color:"#444",marginTop:5}}>{item.content}...</Text>
             </View>
            </TouchableOpacity>
        )
    }


    render() {
        const {abilityInfo,testInfo,refreshing,testTitle} = this.state
        return (
            <View style={{ flex: 1}}>
                <ScrollableTabView
                    style={{}}
                    initialPage={0}
                    // renderTabBar={() => <DefaultTabBar />}
                    renderTabBar={() =>  <ScrollableTabBar
                            activeTextColor="#111"
                            inactiveTextColor='rgba(0,0,0,0.7)'
                            backgroundColor="#F8F8FF"
                            tabStyle={{}}
                        />}
                    tabBarUnderlineStyle={{backgroundColor:"#FF4500",width:20,marginLeft:37}}
                    tabBarTextStyle={{fontSize:12}}
                >
                    {/* 天赋测试 界面 */}
                    <View tabLabel='天赋测试' style={{flex:1}}>
                        <ScrollView>
                            {testTitle.map((v,i)=><View key={i} style={styles.testContainer}>
                            <TouchableOpacity 
                                onPress={()=>this.context.navigate("Test",{
                                    title:v
                                })}
                            >
                                <View style={styles.testItem}>
                                    <View>
                                        <SvgUri svgXmlData={AnswerSheet} width={40} height={40} />
                                    </View>
                                    <View style={{marginLeft:15,marginTop:-20}}>
                                        <Text style={{fontSize:16}}>{v}</Text>
                                        <Text style={{fontSize:10,color:"#444",marginTop:5}}>判断题5道</Text>
                                        
                                    </View>
                                </View>
                            </TouchableOpacity>
                            </View>)}
                        </ScrollView>
                    </View>

                    {/* 能力提升 界面 */}
                    <View tabLabel='能力提升'>
                        <View >
                            <FlatList 
                                keyExtractor={(item,index)=>item.id.toString()}
                                refreshing={refreshing}
                                onRefresh={()=>this.getAbilityInfo()}
                                onEndReached={()=>this.getAbilityInfo(2)}
                                data={abilityInfo}
                                renderItem={this.renderAbility}
                                onEndReachedThreshold={0.3}
                            />
                        </View>

                    </View>
                    {/* <Text tabLabel='Tab #3'>project</Text> */}
                </ScrollableTabView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
      height:500,
      
    },
    testContainer:{
        justifyContent:"center",
        alignItems:"center"
    },
    testItem:{
        flexDirection:'row',
        width:290,
        margin:10,
        padding:10,
        height:80,
        borderRadius:20,
        backgroundColor:"rgba(255,100,10,0.5)",
        alignItems:"center",
        
    },
    renderAbility:{
        padding:13,
        width:screenWidth,
        height:130,
        borderBottomWidth:10,
        borderBottomColor:"lightgray",
        borderColor:"#666"
    }
})