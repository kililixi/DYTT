import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ToastAndroid, Alert, TouchableOpacity, Dimensions, Clipboard} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import AppTop from '../components/AppTop';
import {GetCard, Charge} from '../../util/api'
import { TextInputMask } from 'react-native-masked-text'
import Storage from '../../util/storage';
const DEVICE_WIDTH = Dimensions.get('window').width;

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
  render() {
    const { navigation, screenProps: { themeColor } } = this.props;
    const { code, password, showPassword } = this.state;
	  return (
        <View>
            <AppTop title="推广" navigation={navigation} showLeftIcon={false} themeColor={themeColor}></AppTop>
            <View style={styles.container}>
              <View style={styles.section}>
                <Text style={styles.title}>您的邀请码</Text>
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
  }
})