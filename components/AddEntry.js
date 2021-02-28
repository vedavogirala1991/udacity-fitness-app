import React,{Component} from 'react'
import {View, TouchableOpacity, Text, Platform, StyleSheet} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {getMetricMetaInfo, timeToString, getDailyReminderValue, clearLocalNotification, setLocalNotification} from '../utils/helpers'
import {submitEntry,removeEntry} from '../utils/api'
import {white,purple} from '../utils/colors'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { Ionicons } from '@expo/vector-icons'
import {connect} from 'react-redux'
import {addEntry} from '../actions'

const SubmitBtn = ({onPress}) => {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run :0,
    bike:0,
    swim:0,
    sleep:0,
    eat:0,
  }
  increment = (metric) => {
    const {max,step} = getMetricMetaInfo(metric)

    this.setState((state)=>{
      const count = state[metric] + step

      return {
        ...state,
        [metric] : count > max ? max : count,
      }
    })
  }

  decrement = (metric) => {
    const {step} = getMetricMetaInfo(metric)

    this.setState((state)=>{
      const count = state[metric] - step

      return {
        ...state,
        [metric] : count < 0 ? 0 : count,
      }
    })
  }

  slide = (metric,value) => {
    this.setState((state)=>{
      return {
        ...state,
        [metric] : value,
      }
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = [this.state]

    // Update Redux
    this.props.dispatch(addEntry({
      [key] : entry
    }))

    this.setState(()=>({
      run :0,
      bike:0,
      swim:0,
      sleep:0,
      eat:0,
    }))

    this.toHome()

    submitEntry({key,entry})

    //Clear local notification
    clearLocalNotification()
      .then(setLocalNotification())
  }

  reset = () => {
    const key = timeToString()

    //Update Redux
    this.props.dispatch(addEntry({
      [key] : getDailyReminderValue()
    }))

    this.setState(()=>({
      run :0,
      bike:0,
      swim:0,
      sleep:0,
      eat:0,
    }))

    this.toHome()

    removeEntry(key)
  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key : 'AddEntry'
    }))
  }

  render () {
    const metaInfo = getMetricMetaInfo()

    if(this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy-outline'}
            size={100}/>
          <Text>You already logged your information for today</Text>
          <TextButton style={{padding : 10}} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((key)=>{
          const {getIcon,type,...rest} = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type==='slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value)=>this.slide(key,value)}
                    {...rest}/>
                : <UdaciStepper
                    value={value}
                    onIncrement={()=>this.increment(key)}
                    onDecrement={()=>this.decrement(key)}
                    {...rest}/>
              }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    padding : 20,
    backgroundColor : white,
  },
  row : {
    flexDirection : 'row',
    flex : 1,
    alignItems : 'center',
  },
  iosSubmitBtn : {
    backgroundColor : purple,
    padding : 10,
    borderRadius : 7,
    height : 45,
    marginLeft : 40,
    marginRight : 40,
  },
  androidSubmitBtn : {
    backgroundColor : purple,
    padding : 10,
    paddingLeft : 30,
    paddingRight : 30,
    borderRadius : 2,
    height : 45,
    alignSelf : 'flex-end',
    textAlign : 'center',
    justifyContent : 'center',
  },
  submitBtnText : {
    color : white,
    fontSize : 22,
    textAlign : 'center',
  },
  center : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    marginRight : 30,
    marginLeft : 30,
  },
})

const mapStateToProps = (state) => {
  const key = timeToString()

  return {
    alreadyLogged : state[key][0] && typeof state[key][0].today === 'undefined',
  }
}

export default connect(mapStateToProps)(AddEntry)
