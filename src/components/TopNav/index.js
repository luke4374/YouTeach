import React, { Component } from 'react'
import { Text, View, ImageBackground, StatusBar,StyleSheet,TouchableOpacity } from 'react-native'
import Feather from "react-native-vector-icons/Feather" ;
import { NavigationContext } from "@react-navigation/native";

class Index extends Component {
    static contextType = NavigationContext;
    state = {  }
    render() { 
        return ( 
            <View>
                {/* <StatusBar 
                    backgroundColor="transparent"
                    translucent={true}
                 /> */}
                <ImageBackground 
                    source={require("../../pic/headbg.jpg")}
                    style={styles.backGroundImage}
                >
                    <TouchableOpacity 
                        style={{flexDirection:'row',width:80}}
                        onPress={this.context.goBack}
                        >
                        <Feather name="chevron-left" size={20} style={{color:"#fff"}}/>
                        <Text style={{color:"#fff"}}>返回</Text>
                    </TouchableOpacity>
                    <Text style={{color:"#fff",fontSize:15,fontWeight:"bold"}}>{this.props.title}</Text>
                    <Text style={{width:80}}></Text>
                </ImageBackground>
            </View>
         );
    }
}
const styles = StyleSheet.create({
    backGroundImage:{
        height:60,
        paddingTop:15,
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"space-between"
    }
})
export default Index;