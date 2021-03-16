import React, { Component } from 'react'
import { Text, View , StyleSheet,ScrollView} from 'react-native'
import request from "../../utils/request";
import { ABILITY_DETAIL } from "../../utils/pathMap";
import TopNav from "../../components/TopNav";

export default class AbilityInfo extends Component {

    state={
        infoId:this.props.route.params.infoId,
        title:this.props.route.params.title,
        Detail:{}
    }
    componentDidMount() {
        this.getAbilityInfo();
    }
    //获取能力提升信息
    getAbilityInfo=async()=>{
          const res = await request.get(ABILITY_DETAIL+this.state.infoId)
            console.log(res);
            this.setState({ 
              Detail:res,
            });
      }

    render() {
        const {Detail,title} = this.state;
        return (
            <View style={styles.container}>
                <TopNav title={title}/>
                <View style={styles.context}>
                    <ScrollView>
                        <Text style={{fontSize:20,fontWeight:"bold"}}> {Detail.title} </Text>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{fontSize:13,color:"#999"}}> {Detail.author} </Text>
                            <Text style={{fontSize:13,marginLeft:70,color:"#999"}}> {Detail.post_time} </Text>
                        </View>
                        <Text style={{fontSize:13,color:"#444"}}> {Detail.content} </Text>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
    },
    context:{
        padding:13,
        height:500
    }
})