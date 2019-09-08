import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ToastAndroid, Alert, TouchableOpacity, Dimensions, Clipboard, Image} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import AppTop from '../components/AppTop';
import {GetCard, Charge} from '../../util/api'
import { TextInputMask } from 'react-native-masked-text'
import Storage from '../../util/storage';
const DEVICE_WIDTH = Dimensions.get('window').width;
import { Heading2, Heading3, Paragraph } from '../components/Text'
import Separator from '../components/Separator'

class InviteItem extends PureComponent {
  fire = (type) => {
    console.log('触发方法:', type);
  }

  render() {
    let { name, count, completeCount, bonus, check, type} = this.props
    return (
      <View style={styles.item_container}>
        <View style={[styles.content]}>
          <Image style={styles.icon} source={require('../img/mine/invite.png')} />
          <View style={{flex: 3, flexDirection: 'column', fontSize: 30}}>
            <Text style={styles.invite_text}>{name + (completeCount >= count ? count : completeCount) + '/' + count}</Text>
            <Text style={styles.bonus}>奖励VIP+{bonus}天</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'blue' }} />
          <TouchableOpacity
            onPress={() => check ? '' : this.fire(type)}
            style={styles.button_complete}
            activeOpacity={1}>
              <Text style={[styles.complete, check? styles.disabled: null]}> { check ? '已完成' : '未完成' }</Text>
          </TouchableOpacity>
        </View>
  
        <Separator />
    </View>
    )
  }
}

const i = 20
const task = [{
  name: '累计邀请1位好友',
  type: 'c1',
  check: true,
  bonus: 1,
  count: 1
},{
  name: '累计邀请5位好友',
  type: 'c2',
  check: true,
  bonus: 3,
  count: 5
},{
  name: '累计邀请13位好友',
  type: 'c3',
  check: false,
  bonus: 7,
  count: 13
},{
  name: '累计邀请20位好友',
  type: 'c4',
  check: false,
  bonus: 15,
  count: 20
},{
  name: '累计邀请59位好友',
  type: 'c5',
  check: false,
  bonus: 45,
  count: 59
}]

export default class AdverScreen extends PureComponent {

  state = {
    code: global.userInfo.extraInfo.recommendCode
  };

  async copy(){
    Clipboard.setString(this.state.code);
    ToastAndroid && ToastAndroid.show('复制成功', ToastAndroid.SHORT);
    // let str = await Clipboard.getString()
    // console.log(str)//我是文本
  }

  renderCells(navigation) {
    let cells = []
    task.forEach(v=>{
      let cell =  <InviteItem navigation={navigation} name={v.name} key={v.count} bonus={v.bonus} type={v.type} count={v.count} completeCount={i} check={v.check} />
      cells.push(cell)
    })
    return (
      <View>
        {cells}
      </View>
    )
  }
  
  render() {
    const { navigation, screenProps: { themeColor } } = this.props;
    const { code, password, showPassword } = this.state;
	  return (
        <View>
            <AppTop title="推广" navigation={navigation} showLeftIcon={false} themeColor={themeColor}></AppTop>
            <View style={styles.container}>
              <View style={styles.section}>
                <Text style={styles.title}>我的邀请码</Text>
                <View>
                  <Text style={styles.recommendText}>{this.state.code}</Text>
                </View>
              </View>
              <View style={styles.section}>
                <TouchableOpacity
                  onPress={this.copy.bind(this)}
                  style={[styles.button_charge, {backgroundColor:  themeColor[0]} ]}
                  activeOpacity={1}>
                  <Text style={{color: 'white'}}>复制</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.container}>
              {this.renderCells(navigation)}
            </View>
        </View>
	  );
	}
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
    margin: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button_charge: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: DEVICE_WIDTH/2,
    borderRadius: 20,
    zIndex: 100
  },
  recommendText: {
    fontSize: 30
  },
  item_container: {
    backgroundColor: 'white',
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  content: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
  },
  complete: {
    color: '#000',
    fontWeight: '200'
  },
  disabled: {
    color: '#999999'
  },  
  button_complete: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999999',
    height: 40,
    width: 70,
    borderRadius: 5,
    zIndex: 100
  },
  invite_text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  bonus: {
    fontSize: 16,
    color: '#fbea00f5'
  }
})