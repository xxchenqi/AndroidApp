import React, { Component } from 'react';  
import {
  StyleSheet,  
  Text,  
  View,  
  Image,  
  Dimensions,
  ActivityIndicator,
} from 'react-native';  

var Video = require('react-native-video').default //默认导出
var width =Dimensions.get('window').width//获取屏幕宽度

var Detail = React.createClass({
	getInitialState(){
		var data = this.props.data
		console.log(data)
		console.log(data.video)
		return {
			data:data,
			rate:1,
			muted:false,
			resizeMode:'contain',
			repeat:false,

			videoReady:false,
			videoProgress:0.01,
			videoTotal:0,
			currentTime:0
		}
	},

	_backToList(){
		this.props.navigator.pop()
	},

	_onLoadStart(){
		console.log('load start')
	},
	_onLoad(){
		console.log('loads')
	},
	_onProgress(data){
		if(!this.state.videoReady){
			this.setState({
				videoReady:true
			})
		}

		console.log(data)
		var duration = 12.12
		var currentTime = data.currentTime
		var percent =Number((currentTime/duration).toFixed(2))


		this.setState({
			videoTotal:duration,
			currentTime:Number(data.currentTime.toFixed(2)),
			videoProgress:percent
		})
	},
	_onEnd(){
		console.log('end')
	},
	_onError(e){
		console.log(e)
		console.log('error')
	},

	render(){
		var data = this.props.data
		return(
			<View style={styles.container}>

				<Text onPress={this._backToList}>详情页面</Text>

				<View style={styles.videoBox}>
					<Video
						ref="videoPlayer"//引用	
						source={{uri:data.video}}//视频加载资源
						style={styles.video}
						volume={5}//声音放大倍数
						paused={false}//是否暂停
						rate={this.state.rate}//0:暂停 1:正常
						muted={this.state.muted}//true:静音
						resizeMode={this.state.resizeMode}//视频拉伸方式
						repeat={this.state.repeat}//是否重复播放

						onLoadStart={this._onLoadStart}
						onLoad={this._onLoad}
						onProgress={this._onProgress}
						onEnd={this._onEnd}
						onError={this._onError}/>

					{
						!this.state.videoReady && <ActivityIndicator color='#ee735c' style={styles.loading}/> 
					}

					<View style={styles.progressBox}>
						<View style={[styles.progressBar,{width:width *this.state.videoProgress}]}></View>
					</View>

				</View>

			
			</View>
			)
	}
})

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: '#F5FCFF',  
  },  
  videoBox:{
  	width:width,
  	height:360,
  	backgroundColor:'#000',
  },
  video:{
  	width:width,
  	height:360,
  	backgroundColor:'#000'
  },
  loading:{
  	position:'absolute',
  	left:0,
  	top:140,
  	width:width,
  	alignSelf:'center',
  	backgroundColor:'transparent'
  },
  progressBox:{
  		position:'absolute',
  	width:width,
  	height:2,
  	backgroundColor:'#ccc',
  	bottom:0
  },
  progressBar:{
  	width:1,
  	height:200,
  	backgroundColor:'#ff6600'
  }

})

module.exports = Detail