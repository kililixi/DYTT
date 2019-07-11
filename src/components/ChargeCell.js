
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewPropTypes } from 'react-native'
import { Heading2, Heading3, Paragraph } from './Text'
import Separator from './Separator'
import { screen, system } from '../common'

class ChargeCell extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity  onPress={()=>{ }}>
          <View style={[styles.content, this.props.style]}>
            <Heading3>{ this.props.remark}</Heading3>
            <View style={{ flex: 1, backgroundColor: 'blue' }} />
            <Paragraph style={{ color: this.props.themeColor }}>{' + ' + this.props.chargeValidTime}</Paragraph>
          </View>
          <View style={[styles.timeContent]}>
          <Paragraph style={{ color: '#999999' }}>{this.props.createTime}</Paragraph>
          </View>
          <Separator />
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  content: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
})


export default ChargeCell
