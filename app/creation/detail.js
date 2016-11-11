import React, { Component } from 'react';  
import {
  StyleSheet,  
  Text,  
  View,  
  Image,  
} from 'react-native';  

var Detail = React.createClass({
	_backToList(){
		this.props.navigator.pop()
	},
	render(){
		var row = this.props.row
		return(
			<View style={styles.container}>
				<Text onPress={this._backToList}>详情页面{row._id}</Text>
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

module.exports = Detail