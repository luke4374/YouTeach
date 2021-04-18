import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import request from "../../../utils/request";

@inject("UserStore")
@observer
export default class index extends Component {


    render() {
        return (
            <View>
                <Text> textInComponent </Text>
            </View>
        )
    }
}
