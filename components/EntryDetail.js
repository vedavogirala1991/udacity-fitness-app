import React,{Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import MetricCard from './MetricCard'
import TextButton from './TextButton'
import {connect} from 'react-redux'
import {white} from '../utils/colors'
import {addEntry} from '../actions'
import {removeEntry} from '../utils/api'
import {timeToString, getDailyReminderValue} from '../utils/helpers'

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

  shouldComponentUpdate (nextProps) {
    return nextProps.metrics.length !==0 && !nextProps.metrics[0].today
  }

  reset = () => {
    const {remove, goBack, entryId} = this.props

    remove()
    goBack()
    removeEntry(entryId)
  }

  render() {
    const {metrics} = this.props

    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics[0]}/>
        <TextButton onPress={this.reset} style={{margin : 20}}>
          Reset
        </TextButton>
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

const mapDispatchToProps = (dispatch, {navigation}) => {
  const {entryId} = navigation.state.params

  return {
    remove : () => dispatch(addEntry({
      [entryId] : timeToString() === entryId
        ? getDailyReminderValue()
        : new Array()
    })),
    goBack : () => navigation.goBack(),
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : white,
    padding : 15,
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(EntryDetail)
