import React, { Component } from 'react';  
import {
  StyleSheet,  
  Text,  
  View,  
  Image, 
  ListView, 
  TouchableHighlight,//透明点击层
  Dimensions,//用来获取屏幕宽度
  ActivityIndicator,//替代进度条
  RefreshControl,//下拉刷新控制器
  Alert,
} from 'react-native';  
import Icon from 'react-native-vector-icons/Ionicons';
import Mock from 'mockjs';
import request from '../common/request';
import config from '../common/config'; 
var width =Dimensions.get('window').width//获取屏幕宽度
var Detail = require('./detail')

//申明缓存
var cachedResults = {
  nextPage:1,//页数
  items:[],//数据
  total:0//总量
}

var Item = React.createClass({
  getInitialState(){
    var row = this.props.row

    return {
      up:row.voted,
      row:row
    }
  },
  _up(){
    var that = this
    var up = !this.state.up
    var row = this.state.row
    var url = config.api.base + config.api.up

    var body = {
      id:row._id,
      up:up ? 'yes' : 'no',
      accessToken : 'abce'
    }
    //点赞请求
    request.post(url,body)
      .then(function(data){
        if(data.success){
          that.setState({
            up:up
          })
        }else{
          Alert.alert('','点赞失败')
        }
      })
      .catch(function(err){
        console.log(err)
      })
  },
  render(){
    var row = this.state.row
    return(
       //透明点击层
      <TouchableHighlight onPress={this.props.onSelect} >
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <Image
            source={{uri:row.thumb}}
            style={styles.thumb}>
            <Icon
              name='ios-play'
              size={28}
              style={styles.play} />
          </Image>

          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
              name={this.state.up?'ios-heart':'ios-heart-outline'}
              size={28}
              onPress={this._up}
              style={[styles.up,this.state.up?null:styles.down]} />
              <Text style={styles.handleText} onPress={this._up}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
              name='ios-chatboxes-outline'
              size={28}
              style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
})

var List = React.createClass({
    getInitialState() {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2//通过rowHasChanged获取内容是否被改变
    });
    return {
      isRefreshing:false,//下拉刷新初始设置为false
      isLoadingTail:false,//正在加载，默认为false
      dataSource: ds.cloneWithRows([]),//初始化为空数据
    };
  },

  _renderRow(row){
    return <Item 
      key={row._id} 
      onSelect= {()=>this._loadPage(row)} 
      row={row} />
  },

  componentDidMount(){//组件加载完之后请求数据
    this._fetchData(1)//第一次请求页数传1
  },

  _fetchData(page){//这个方法是私有方法_
    if(page!==0){
      this.setState({
        isLoadingTail:true//正在请求，修改状态isloading为true
      })
    }else{
      this.setState({
        isRefreshing:true
      })
    }
  
    //请求接口,传参
    request.get(config.api.base + config.api.creations,{
      accessToken:'123',
      page:page
    })
      .then((data) => {
        // var data = Mock.mock(data)//通过mock获取假数据
        if(data.success){
          var items = cachedResults.items.slice()
          if(page!==0){
            items = items.concat(data.data)
            cachedResults.nextPage +=1
          }else{
            items = data.data.concat(items)
          }

          cachedResults.items = items 
          cachedResults.total = data.total
          console.log(items);

          if(page!==0){
            this.setState({
              isLoadingTail:false,
              dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)//设置数据到listview
            })
          }else{
            this.setState({
              isRefreshing:false,
              dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)//设置数据到listview
            })
            console.log('刷新成功');
          }
       
        }
      })
      .catch((error) => {
        if(page!==0){
          this.setState({
            isLoadingTail:false
          })
        }else{
          this.setState({
            isRefreshing:false
          })
        }
        console.warn(error);
      })
  },


  _hasMore(){
    return cachedResults.items.length !== cachedResults.total //当前的数量 不等于 总数量 
  },

  _fetchMoreData(){
    if(!this._hasMore() || this.state.isLoadingTail){//如果没有更多数据或者正在加载就不去重新加载了
      return
    }

    var page = cachedResults.nextPage
    this._fetchData(page)
  },
  _onRefresh(){
    if(!this._hasMore()||this.state.isRefreshing){
      return
    }
 
    this._fetchData(0)
  },
  _renderFooter(){
    if(!this._hasMore() && cachedResults.total !== 0){
      return(
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }
    if(!this.state.isLoadingTail){
      return <View style={styles.loadingMore}/>
    }
    return  <ActivityIndicator style={styles.loadingMore}/> 
  },
  _loadPage(row){//打开详情页
    this.props.navigator.push({//压栈操作
      name:'detail',
      component: Detail,
      params:{
        row:row
      }
    })
  },

	render(){
		return(
			<View style={styles.container}>
        <View style={styles.header}>
				  <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}//数据源
          renderRow={this._renderRow}//渲染子项
          enableEmptySections={true}//去除警告
          automaticallyAdjustContentInsets={false}//取消顶部分割线
          onEndReached={this._fetchMoreData}//滑动到底部加载更多方法
          onEndReachedThreshold={20}//滑动到离底部20的时候去触发方法
          renderFooter={this._renderFooter}//底部渲染哪个VIEW
          showsVerticalScrollIndicator={false}//隐藏滚动条
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff6600"
              colors={['#ff0000', '#00ff00', '#0000ff']}
            />
          }
        />
			</View>
			)
	}
})

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: '#F5FCFF' 
  },  
  header:{
    paddingTop:25,
    paddingBottom:12,
    backgroundColor:'#ee735c'
  },
  headerTitle:{
    width:width,
    color:'#fff',
    fontSize:16,
    textAlign:'center',
    fontWeight:'600'
  },
  item:{
    width:width,
    marginBottom:10,
    backgroundColor:'#fff'
  },
  thumb:{
    width:width,
    height:width*0.56,
    resizeMode:'cover'
  },
  title:{
    padding:10,
    fontSize:18,
    color:'#333'
  },
  itemFooter:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#eee'
  },
  handleBox:{
    padding:10,
    flexDirection:'row',
    width:width/2-0.5,
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  play:{
    position:'absolute',
    bottom:14,
    right:14,
    width:46,
    height:46,
    paddingTop:9,
    paddingLeft:18,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:23,
    color:'#ed7b66'
  },
  handleText:{
    paddingLeft:12,
    fontSize:18,
    color:'#333'
  },
  up:{
    fontSize:22,
    color:'#ed7b66'
  },
  down:{
    fontSize:22,
    color:'#333'
  },
  commentIcon:{
    fontSize:22,
    color:'#333'
  },
  loadingMore:{
    marginVertical:20
  },
  loadingText:{
    color:'#777',
    textAlign:'center'
  }

})

module.exports = List