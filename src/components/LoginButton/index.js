import React, { Component } from 'react'
import { 
  Text, 
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

export default class index extends Component {
  static defaultProps={
    style:{},
    textStyle:{},
    disabled:false
  }
    render() {
        return (
            <TouchableOpacity 
            disabled={this.props.disabled}
            //子向父传递 执行父级onpress
            onPress={this.props.onPress}
            style={{width:"100%",height:"100%",...this.props.style,overflow:"hidden"}}
            >
              <LinearGradient 
                start={{x:0,y:0}} end={{x:1,y:0}} 
                colors={['#7FFFD4', '#ADFF2F']} 
                style={styles.linearGradient}
              >
                <Text style={{...styles.buttonText,...this.props.textStyle}}>
                  {this.props.children}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
        )
    }
}
// Later on in your styles..
const styles = StyleSheet.create({
    linearGradient: {
      width:"100%",
      height:"100%",
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 100,
      justifyContent:'center',
      alignItems:'center'

    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      marginTop: 10,
      height:40,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  });