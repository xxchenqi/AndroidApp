import React, { Component } from 'react';  
import {
  StyleSheet,  
  Text,  
  View,  
  Image,  
} from 'react-native';  

var Edit = React.createClass({
	render(){
		return(
			<View style={styles.container}>
				<Text>制作页面</Text>
			</View>
			)
	}
})

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#F5FCFF',  
  },  
  welcome: {  
    fontSize: 20,  
    textAlign: 'center',  
    margin: 10,  
  },  
});  


module.exports = Edit