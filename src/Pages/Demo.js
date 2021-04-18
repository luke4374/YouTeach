import React, {useState,Component} from 'react';
import { 
  Text, 
  View,
  StyleSheet,
  Dimensions, 
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { goBack,question } from "../res/fonts/iconSg";
import TopNavHome from "../components/TopNav";
import SvgUri from "react-native-svg-uri";
import { inject, observer } from "mobx-react";
import Toast from '../utils/Toast';

@inject("RootStore","UserStore")
@observer    
export default class Demo extends Component {

    state = {
      // status :this.props.RootStore.status,
      totalScore:this.props.route.params.totalScore,
      Score:this.props.route.params.Score,
      myScore:0,
      cards:this.props.route.params.cards,
      answers:this.props.route.params.answers,
      wrongAnswer:this.props.route.params.wrongAnswer,
      rightAnswer:this.props.route.params.rightAnswer,
      chooseNum:0
    }
    componentDidMount() {
      const { rightAnswer,answers,wrongAnswer,totalScore,Score,myScore } = this.state
      // this.getCollection();
      this.compareAnswer()
      console.log(rightAnswer,answers,wrongAnswer,totalScore,Score,myScore);
    }
    //检查答案
    compareAnswer=()=>{
      const { rightAnswer,answers,wrongAnswer,totalScore,Score } = this.state
      let tempScore = totalScore
      //判断数组长度是否相等
      if(rightAnswer.length == answers.length){
          for (let i = 0; i < rightAnswer.length; i++) {
              if(rightAnswer[i] != answers[i]){
                  tempScore -= Score
                  wrongAnswer.push(i+1)
                  console.log("错误答案");
                  console.log(wrongAnswer);
              }else{
                  wrongAnswer.push(0)
              }
          }
          this.setState({ myScore: tempScore  });
      }else{
          Toast.sad("抱歉出错啦",1000,"center")
      }

  }
  render(){
    const {totalScore,myScore,cards,answers,wrongAnswer,chooseNum} = this.state
    var result = null;
    return(
      <View style={styles.container}>
                   <View style={styles.overlay}>
                {/* 第一层 */}
                <View style={{width:"100%",padding:10,position:"relative",justifyContent:"center"}}>
                      <View style={{position:"absolute"}}>
                        <TouchableOpacity 
                            style={{height: 30,flexDirection:"row",}}
                            onPress={()=>{this.props.navigation.navigate("Nav")}}
                        >
                            <SvgUri svgXmlData={goBack} width="30" height="30" />
                            <Text style={{fontSize:14,color:"#666",marginTop:3}}>返回</Text>
                        </TouchableOpacity>
                      </View>
                        <View style={{alignSelf:"center"}}>
                            <Text style={{fontSize:14,color:"#666"}}>我的成绩</Text>
                        </View>
                </View>
                {/* 第二层 */}
                <View style={{marginTop:30}}>
                    <View style={styles.Score}>
                        <Text style={{fontSize:30,color:"#DC143C"}}>{myScore}</Text>
                        <Text style={{fontSize:30}}>/</Text>
                        <Text style={{fontSize:30,color:"#7FFF00"}}>{totalScore}</Text>
                    </View>    
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                        
                        {cards.map((v,i)=>{
                            if (i == chooseNum) {
                                result = null
                                result = <View style={{marginTop:30}}>
                                            <Text style={{marginTop:10}}>{v.qs_question}</Text>
                                            <View style={{justifyContent:"space-around",marginTop:10,marginBottom:30}}>
                                                <Text style={{fontSize:15}}>A: {v.qs_choiceA}</Text>
                                                <Text style={{fontSize:15}}>B: {v.qs_choiceB}</Text>
                                            </View>
                                            <Text style={{fontSize:17,fontWeight:"300",color:"lightgreen"}}>正确答案：{v.qs_right}</Text>
                                            <Text style={{fontSize:17,fontWeight:"300",color:"red"}}>我的答案：{answers[i]}</Text>
                                            {/* <Text>{setVisible.toString()}</Text> */}
                                        </View> 
                            }
                            return(
                                <View>
                                    <TouchableOpacity style={{
                                        justifyContent:"center",
                                        alignItems:"center",
                                        height:40,
                                        width:40,
                                        borderRadius:20,
                                        backgroundColor:wrongAnswer.includes(i+1)?"red":"lightgreen"}}
                                        onPress={()=>{
                                            this.setState({ chooseNum:i })
                                        }}>
                                        <Text>{i+1}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })} 
                    </View>
                </View>
                {/* 第三层 */}
                <View>
                    {result}
                </View>
            </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  overlay:{
    backgroundColor: '#E1FFFF',
    padding: 10,
    borderRadius: 15,
    // alignItems: 'center',
    // width:270,
    height:"100%"
},
Score:{
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
    marginBottom:30
},
});