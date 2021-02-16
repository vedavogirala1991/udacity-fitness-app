import React, {Component} from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'
import {recieveEntries,addEntry} from '../actions'
import {timeToString,getDailyReminderValue} from '../utils/helpers'
import {fetchCalendarResults} from '../utils/api'
import {Agenda as UdaciFitnessCalendar } from 'react-native-calendars'
import DateHeader from './DateHeader'
import {white} from '../utils/colors'

class History extends Component {
  componentDidMount() {
    const {dispatch} = this.props

    fetchCalendarResults()
      .then((entries) => dispatch(recieveEntries(entries)))
      .then(({entries})=> {
        if(!entries[timeToString()]) {
          dispatch(addEntry({
            [timeToString()]:getDailyReminderValue()
          }))
        }
      })
  }

  renderItem = ({today,...metrics}, formattedDate, key) => {
    return (
    <View style={styles.item}>
      {today
        ? <View>
            <Text style={styles.noDataText}>
              {today}
            </Text>
          </View>
        : <TouchableOpacity onPress={()=>console.log('Press')}>
            <Text>{JSON.stringify(metrics)}</Text>
          </TouchableOpacity>
      }
    </View>)
  }

  renderEmptyDate(formattedDate) {
    return (
      <View style={styles.item}>
        <Text style={styles.noDataText}>
          You didn't log any data for this day.
        </Text>
      </View>
    )
  }

  render () {
    const {entries} = this.props
    return (
      <UdaciFitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    )
  }
}

const styles = StyleSheet.create({
  item : {
    backgroundColor : white,
    borderRadius : Platform.OS === 'ios' ? 10 : 8,
    padding : 20,
    marginLeft : 10,
    marginRight : 10,
    marginTop : 17,
    justifyContent : 'center',
    shadowRadius : 3,
    shadowOpacity : 0.8,
    shadowColor : 'rgba(0,0,0,0.24)',
    shadowOffset : {
      width : 0,
      height : 3,
    },
  },
  noDataText : {
    fontSize : 20,
    paddingTop : 20,
    paddingBottom : 20,
  }
})


const mapStateToProps = (entries) => {
  return {
    entries
  }
}

export default connect(mapStateToProps)(History)
