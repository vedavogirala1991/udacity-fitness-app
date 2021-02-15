import { StatusBar } from 'expo-status-bar'
import React,{Component} from 'react'
import {View,
        Text,
        StyleSheet,
        TouchableHighlight,
        TouchableOpacity,
        TouchableNativeFeedback,
        TouchableWithoutFeedback} from 'react-native'
import AddEntry from './components/AddEntry'
import History from './components/History'
import reducer from './reducers'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

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
          <History />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    marginTop : 30,
  }
})

export default App
