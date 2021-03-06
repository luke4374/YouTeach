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



    onSwipedAll=()=>{
        const {totalScore,myScore,cards,answers,wrongAnswer,Score,rightAnswer} = this.state;
        // this.setState({ setVisible:true })
        this.compareAnswer()
        this.props.navigation.navigate("Demo",{
            rightAnswer,
            totalScore,
            myScore,
            cards,
            answers,
            wrongAnswer,
            Score
        })
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
   
})