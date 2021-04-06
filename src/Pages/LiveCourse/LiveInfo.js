import React, { Component } from 'react'
import { Text, View } from 'react-native'
import TopNav from "../../components/TopNav";

export default class LiveInfo extends Component {
    render() {
        return (
            <View>
                <TopNav title={this.props.route.params.title}/>
                <Text> LiveInfo </Text>
            </View>
        )
    }
}
