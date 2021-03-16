import { inject, observer } from "mobx-react";
import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
@inject("RootStore","UserStore")
@observer
export default class Demo1 extends Component {
    /**
     * render重新执行--> state发生改变/props发生改变
     */

    handleChangestate=()=>{
        this.props.RootStore.Changestat();
    }

    render() {
        return (
            <View>
            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                <TouchableOpacity
                    onPress={this.handleChangestate}
                >
                    <View style={{height:40,width:60,backgroundColor:"blue"}}>
                        <Text> 点击更改状态 </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=>this.props.navigation.goBack()}
                >
                    <View  style={{height:40,width:60,backgroundColor:"green"}}>
                        <Text> 返回 </Text>
                    </View>
                </TouchableOpacity>
                
            </View>
                <Text>状态：{this.props.RootStore.status.toString()} </Text>
            </View>
        )
    }
}
