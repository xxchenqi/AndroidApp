/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


 import React, { Component } from 'react';  
 import {  
  AppRegistry,  
  StyleSheet,  
  Text,  
  View,  
  Image,
  Navigator,
} from 'react-native';  

//引入tabbar支持包  
import TabNavigator from 'react-native-tab-navigator';  
import Icon from 'react-native-vector-icons/Ionicons';

const TabNavigatorItem =TabNavigator.Item;  

const TAB_NORMAL_1=require('./images/tabbar_1.png');  
const TAB_NORMAL_2=require('./images/tabbar_2.png');  
const TAB_NORMAL_3=require('./images/tabbar_3.png');  
const TAB_NORMAL_4=require('./images/tabbar_4.png');  

const TAB_PRESS_1=require('./images/tabbar_1_press.png');  
const TAB_PRESS_2=require('./images/tabbar_2_press.png');  
const TAB_PRESS_3=require('./images/tabbar_3_press.png');  
const TAB_PRESS_4=require('./images/tabbar_4_press.png');  

var List = require('./app/creation/index')
var Edit = require('./app/edit/index')
var Account = require('./app/account/index')

class AwesomeProject extends Component {  

  constructor(){  
    super();  
    this.state={  
      selectedTab:'list',  
    }  
  }  
  /** 
  tab点击方法 
  **/  
  onPress(tabName){  
    if(tabName){  
      this.setState(  
      {  
        selectedTab:tabName,  
      }  
      );  
    }  
  }  
   
   /** 
   自定义tabbar 
   **/  
   tabBarView(){  
    return (  
      <TabNavigator tabBarStyle={styles.tab}>
         <TabNavigatorItem  
          renderIcon={()=><Image style={styles.tabIcon} source={TAB_NORMAL_1}/>}  
          renderSelectedIcon={()=><Image style={styles.tabIcon} source={TAB_PRESS_1}/>}  
          selected={this.state.selectedTab==='list'}  
          selectedTitleStyle={{color:'#f85959'}}  
          onPress={()=>this.onPress('list')}> 
          <Navigator
            initialRoute={{ //初始化list
              name:'list',
              component:List
            }}
            configureScene={(route)=>{
              return Navigator.SceneConfigs.FloatFromRight
            }}
            renderScene={(route,navigator)=>{//route传进renderScene
              var Component = route.component//获取List组件return 出去
              return <Component {...route.params} navigator={navigator} //navigator传到List 相当于props
                />
            }} />
        </TabNavigatorItem>

        <TabNavigatorItem  
          renderIcon={()=><Image style={styles.tabIcon} source={TAB_NORMAL_2}/>}  
          renderSelectedIcon={()=><Image style={styles.tabIcon} source={TAB_PRESS_2}/>}  
          selected={this.state.selectedTab==='edit'}  
          selectedTitleStyle={{color:'#f85959'}}  
          onPress={()=>this.onPress('edit')}> 
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Edit/>
          </View> 
        </TabNavigatorItem>

        <TabNavigatorItem  
          renderIcon={()=><Image style={styles.tabIcon} source={TAB_NORMAL_3}/>}  
          renderSelectedIcon={()=><Image style={styles.tabIcon} source={TAB_PRESS_3}/>}  
          selected={this.state.selectedTab==='account'}  
          selectedTitleStyle={{color:'#f85959'}}  
          onPress={()=>this.onPress('account')}> 
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Account/>
          </View> 
        </TabNavigatorItem>  
      </TabNavigator>  
      );  
  }  
  
  
  render() {  
    var tabBarView=this.tabBarView();  
    return ( 
      <View style={styles.container}>  
      {tabBarView}
      </View>  
      );  
  }  
}  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: '#F5FCFF',  
  },  
  welcome: {  
    fontSize: 20,  
    textAlign: 'center',  
    margin: 10,  
  },  
  instructions: {  
    textAlign: 'center',  
    color: '#333333',  
    marginBottom: 5,  
  },  
  tab:{  
    height: 52,  
    alignItems:'center',  
    backgroundColor:'#f4f5f6',  
  },  
  tabIcon:{  
    width:25,  
    height:25,  
  }
});  

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
