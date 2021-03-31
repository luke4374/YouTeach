import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import TopNav from "../components/TopNav";

export default class LiveCourse extends Component {
    render() {
        return (
            <View>
                <TopNav title={this.props.route.params.title+"直播课"}/>
                <View style={styles.class}>
                    <Text style={{fontWeight:"600",fontSize:20}}>好课推荐</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    class:{
        margin:10
    }
})
