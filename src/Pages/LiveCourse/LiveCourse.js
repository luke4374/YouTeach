import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import TopNav from "../../components/TopNav";
import request from "../../utils/request";
import { FIND_LIVECOURSE } from "../../utils/pathMap";
import { TouchableOpacity } from 'react-native';

export default class LiveCourse extends Component {
    state={
        title:this.props.route.params.title,
        liveCourse:[],
        compareTime:false
    }

    componentDidMount() {
        // this.compareTime('2021-4-5')
        this.getCourse();
    }

    getCourse=async()=>{
        const res = await request.get(FIND_LIVECOURSE);
        this.setState({ liveCourse: res });
    }

    compareTime=(etime)=>{
        //开始时间
        // var arrs = stime.split("-");
        // var startTime = new Date(arrs[0], arrs[1], arrs[2]);
        // var startTimes = startTime.getTime();
        //结束时间
        var arre = etime.split("-");
        var endTime = new Date(arre[0], arre[1], arre[2]);
        var endTimes = endTime.getTime();
        //当前时间
        var thisDate = new Date();
        var thisDates = thisDate.getFullYear() + "-0" + (thisDate.getMonth() + 1) + "-" + thisDate.getDate();
        var arrn = thisDates.split("-");
        var nowTime = new Date(arrn[0], arrn[1], arrn[2]);
        var nowTimes = nowTime.getTime();
        console.log(nowTimes);
        console.log(nowTimes - endTimes<=0);
        // console.log(nowTimes === endTimes);
        if (nowTimes - endTimes<=0) {
            this.setState({ compareTime: true })
        }
            console.log(this.state.compareTime);

        // if (nowTimes === endTimes) {
        // //     this.setState({ compareTime: false });
        // // }else{
        //     this.setState({ compareTime: true });
        // }
    }

    render() {
        const {title,liveCourse} = this.state
        return (
            <View style={{backgroundColor:"#FFF",flex:1}}>
                <TopNav title={title+"直播课"}/>
                <View style={styles.class}>
                    <Text style={{fontWeight:"600",fontSize:20}}>好课推荐</Text>
                        {liveCourse.map((v,i)=>
                            <TouchableOpacity style={styles.blocks} 
                                onPress={()=>this.props.navigation.navigate("LiveInfo",{
                                    title:v.l_info
                                })}>
                                <View>
                                    <Text>{v.l_info}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    class:{
        margin:10,
    },
    blocks:{
        width:"90%",
        height:100,
        borderRadius:6,
        backgroundColor:"#F5F5F5",
        alignSelf:"center",
        marginBottom:15
    }
})
