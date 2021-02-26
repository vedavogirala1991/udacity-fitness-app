import React,{Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import MetricCard from './MetricCard'
import {connect} from 'react-redux'
import {white} from '../utils/colors'

class EntryDetail extends Component {
  static navigationOptions = ({navigation}) => {
    const {entryId} = navigation.state.params

    const year = entryId.slice(0,4)
    const month = entryId.slice(5,7)
    const day = entryId.slice(8)

    return {
      title : `${month}/${day}/${year}`
    }
  }
  render() {
    const {metrics} = this.props

    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics[0]}/>
      </View>
    )
  }
}

const mapStateToProps = (state, {navigation}) => {
  const {entryId} = navigation.state.params

  return {
    entryId,
    metrics : state[entryId]
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : white,
    padding : 15,
  }
})

export default connect(mapStateToProps)(EntryDetail)
