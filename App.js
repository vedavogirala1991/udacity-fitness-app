import React,{Component} from 'react'
import {View,
        StyleSheet,
        Platform,
        StatusBar} from 'react-native'
import AddEntry from './components/AddEntry'
import History from './components/History'
import EntryDetail from './components/EntryDetail'
import {purple, white} from './utils/colors'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createStackNavigator} from 'react-navigation-stack'
import reducer from './reducers'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'

const UdaciStatusBar = ({backgroundColor,...props}) => {
  return (
    <View style={{backgroundColor, height : Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const RouteConfigs = {
  History : {
    screen : History,
    navigationOptions : {
      tabBarLabel : 'History',
      tabBarIcon : ({ tintColor }) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />
    }
  },
  AddEntry : {
    screen : AddEntry,
    navigationOptions : {
      tabBarLabel : 'Add Entry',
      tabBarIcon : ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor} />
    }
  }
}

const TabNavigatorConfig = {
  navigationOptions : {
    headerShown : false
  },
  tabBarOptions: {
    activeTintColor : Platform.OS === 'ios' ? purple : white,
    style : {
      height : 56,
      backgroundColor : Platform.OS === 'ios' ? white : purple,
      shadowColor : 'rgba(0, 0, 0, 0.24)',
      shadowOffset : {
        width : 0,
        height : 3
      },
      shadowRadius : 6,
      shadowOpacity : 1
    }
  }
}

const Tabs = createBottomTabNavigator(RouteConfigs, TabNavigatorConfig)

const MainNavigator = createAppContainer(createStackNavigator({
  Home: {
    screen : Tabs,
  },
  EntryDetail : {
    screen : EntryDetail,
    navigationOptions : {
      title : 'Entry Detail',
      headerTintColor : white,
      headerStyle : {
        backgroundColor : purple,
      }
    }
  }
},{
  navigationOptions : {
    headerShown : false
  }
}))

class App extends Component {
  componentDidMount() {
    console.log('Before')
    debugger
    console.log('After')
  }
  render () {
    return (
      <Provider store={createStore(reducer)}>
        <View style={styles.container}>
          <UdaciStatusBar backgroundColor={purple} barStyle='light-content'/>
          <MainNavigator />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
  }
})

export default App
