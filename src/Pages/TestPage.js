import React, { Component } from 'react'
import { Text, View, StyleSheet,TouchableOpacity,Button } from 'react-native'
import request from "../utils/request";
import Toast from "../utils/Toast";
import { Overlay } from "teaset";
import { TEST_FINDTEST,TEST_FINDANSWERS,TEST_findTotalScore } from "../utils/pathMap";
import TopNav from "../components/TopNav";
import { ImageBackground } from 'react-native';
import Swiper from "react-native-deck-swiper";
import SvgUri from "react-native-svg-uri";
import { AAA,BBB,triqueta,goBack,question } from "../res/fonts/iconSg";

export default class TestPage extends Component {

    constructor(props){
        super(props);
        this.swiperRef = React.createRef();
    }
    state={
        title:this.props.route.params.title,
        rightAnswer:[],
        answers:[],
        cards:[],
        wrongAnswer:[],
        Score:0,
        totalScore:0,
        myScore:0,
        setVisible:false,
        currentIndex:0,
        chooseNum:0
    }

    componentDidMount() {
        this.getTest();
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

    getTest=async()=>{
        const {title} = this.state
        const data = await request.get(TEST_FINDTEST+title)
        const correctAnswers = await request.get(TEST_FINDANSWERS+title)
        const TotalScore = await request.get(TEST_findTotalScore+title)
        // console.log("测试题数据：");
        this.setState({ 
            cards:data,
            rightAnswer:correctAnswers,
            totalScore:TotalScore,
            Score:data[0].qs_score
        });
        console.log(data[0].qs_score);

    }

    // 选项滑动swiper
    setChoice=(type)=>{
        if (type === "A") {
            this.swiperRef.swipeLeft();
        } else {
            this.swiperRef.swipeRight();
        }
    }

    sendChoice=(choice)=>{
        this.state.answers.push(choice)
        console.log(this.state.answers);
    }
    
    overlayGoback=()=>{
        this.setState({ setVisible:false  });
        console.log(this.state.setVisible)
        this.props.navigation.navigate("Nav")
    }

    showOverlay=()=> {
        const {totalScore,myScore,cards,answers,setVisible,wrongAnswer,chooseNum} = this.state
        var num = 0;
        var result = null;
        let overlayView = (
          <Overlay.View
            style={styles.overlayContainer}
            modal={false}
            
            overlayOpacity={0}
            ref={v => this.overlayView = v}
            >
            <View style={styles.overlay}>
                {/* 第一层 */}
                <View style={{justifyContent:"center",alignItems:"center",position:"relative",marginTop:15}}>
                    <View style={{marginTop:4,flexDirection:"row",position:"absolute",left:0}}>
                        <TouchableOpacity 
                            style={{height: 30,flexDirection:"row",width:"50%"}}
                            onPress={()=>this.overlayView && this.overlayView.close()}
                        >
                            <SvgUri svgXmlData={goBack} width="30" height="30" />
                            <Text style={{fontSize:14,color:"gray"}}>返回</Text>
                        </TouchableOpacity>
                        <View>
                            <Text style={{fontSize:14,color:"gray"}}>我的成绩</Text>
                        </View>
                    </View>
                </View>
                {/* 第二层 */}
                <View style={{marginTop:30}}>
                    <View style={styles.Score}>
                        <Text style={{fontSize:25,color:"#DC143C"}}>{myScore}</Text>
                        <Text style={{fontSize:25}}>/</Text>
                        <Text style={{fontSize:25,color:"#7FFF00"}}>{totalScore}</Text>
                    </View>    
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                        
                        {cards.map((v,i)=>{
                            if (i == chooseNum) {
                                result = null
                                result = <View style={{width:250}}>
                                            <Text style={{marginTop:10}}>{v.qs_question}</Text>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:10,marginBottom:30}}>
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
                                        backgroundColor:wrongAnswer.includes(i+1)?"red":"lightgreen"
                                        }}
                                        onPress={()=>{
                                            result=null
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
          </Overlay.View>
        );
        Overlay.show(overlayView);
        // if(setVisible == true){
        //     Overlay.show(overlayView);
        // }else{
        //     this.overlayView && this.overlayView.close()
        // }
      }
    //未使用
    // onSwipedAll=()=>{
    //     const {visible,setVisible} = this.state;
    //     Toast.smile("已完成所有题目~",1000,"center")
    //     this.setState({ setVisible:!this.state.visible  });
    //     console.log(setVisible);
    //     // if(this.state.showResult){
    //     //     this.props.navigation.goBack();
    //     //     console.log(this.state.showResult);
    //     // }
    //     // this.renderResult()
    // }

    onSwipedAll=()=>{
        this.setState({ setVisible:true })
        this.compareAnswer()
    }

    render() {
        const {title,cards,currentIndex,totalScore} = this.state
        if(cards.length===0){
            return <></>
        }
        return (
            <View style={styles.container}>
                <TopNav title = {title}></TopNav>
                {/* 背景图片 */}
                <ImageBackground 
                    style={{height:"60%",width:"100%"}}
                    imageStyle={{height:"100%", borderBottomLeftRadius:15,borderBottomRightRadius:15}}
                    source={require("../pic/redbg.jpg")}
                >
                {/* 背景图片结束 */}
                        <Swiper
                            ref={ ref => this.swiperRef = ref}
                            cards={cards}
                            renderCard={(card) => {
                                return (
                                    <View style={styles.card}>
                                        <View style={{alignItems:"center",marginTop:10}}>
                                            <SvgUri svgXmlData={triqueta} width="50" height="50" />
                                        </View>
                                        <Text style={styles.text}>{card.qs_question}</Text>
                                        {/* 选项栏 */}
                                        <View style={styles.choice}>
                                            <TouchableOpacity onPress={this.setChoice.bind(this,"A")}>
                                                <SvgUri svgXmlData={AAA} width="60" height="60" />
                                                <Text style={styles.ChoiceText}>{card.qs_choiceA}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.setChoice.bind(this,"B")}>
                                                <SvgUri svgXmlData={BBB} width="60" height="60" />
                                                <Text style={styles.ChoiceText}>{card.qs_choiceB}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {/* 选项结束 */}
                                    </View>
                                )
                            }}
                            onSwiped={(cardIndex) => {this.setState({ currentIndex:cardIndex  });}}
                            onSwipedAll={this.onSwipedAll}
                            onSwipedLeft={this.sendChoice.bind(this,"A")}
                            onSwipedRight={this.sendChoice.bind(this,"B")}
                            cardIndex={currentIndex}
                            backgroundColor={'transparent'}
                            cardVerticalMargin={10}
                            stackSize= {6}>

                        </Swiper>
                </ImageBackground>
                {this.state.setVisible? this.showOverlay():null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    card: {
        // flex: 1,
        height:400,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        // justifyContent: "center",
        backgroundColor: "antiquewhite"
    },
    text: {
        // textAlign: "center",
        fontSize: 15,
        padding:12,
        // backgroundColor: "transparent",
        marginTop:10
    },
    choice:{
        marginTop:70,
        flexDirection:"row",
        justifyContent:"space-around",
        height:120,
        width:"100%"
    },
    ChoiceText:{
        marginLeft:10,
        fontSize:16,
        fontWeight:"500"
    },
    overlayContainer:{
        alignItems: 'center', 
        justifyContent: 'center',
    },
    overlay:{
        backgroundColor: '#E1FFFF',
        padding: 10,
        borderRadius: 15,
        // alignItems: 'center',
        width:270,
        height:450
    },
    Score:{
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        marginBottom:30
    }
})