import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ToastAndroid, Alert, TouchableOpacity, Dimensions} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import AppTop from '../components/AppTop';
import {GetCard, Charge} from '../../util/api'
import { TextInputMask } from 'react-native-masked-text'
import Storage from '../../util/storage';
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class ChargeScreen extends PureComponent {

  state = {
    code: '',
    password: '',
    showPassword: false,
    loading: false
  };
  pinInput = React.createRef();
  pwdInput = React.createRef();

  _checkCode = () => {
    // if (code != '1234') {
    //   this.pinInput.current.shake()
    //     .then(() => this.setState({ code: '' }));
    // }
    // console.log('code', this.state.code, this.refs.codeRef.getRawValue())
    const self = this
    if(this.refs.codeRef.getRawValue().length < 10) {
      ToastAndroid && ToastAndroid.show('请输入正确的卡号', ToastAndroid.SHORT);
      return
    }
    GetCard(this.refs.codeRef.getRawValue()).then(data=>{
      console.log('data', data)
      if(data.stateCode === '1') {
        this.setState({ code: '' })
        ToastAndroid && ToastAndroid.show('不存在该卡号或是已被使用', ToastAndroid.LONG);
        return
      }
      Alert.alert(
        '充值确认',
        '确认充值' + data.cardtypeValue + '到您的账户中吗?',
        [
          {text: '取消', onPress: () => {}},
          {text: '确定', onPress: () => {
            console.log('confirm')
            self.setState({ showPassword: true })
          }},
        ],
        { cancelable: true }
      )
    }).catch(()=>{
      this.setState({ code: '' })
      ToastAndroid && ToastAndroid.show('不存在该卡号或是已被使用', ToastAndroid.LONG);
    })
  }

  _confirmNext() {
    this.setState({ showPassword: true })
  }

  subitForm = () => {
    if(this.state.loading) return
    if(this.refs.codeRef.getRawValue().length < 8) {
      ToastAndroid && ToastAndroid.show('请输入正确的密码', ToastAndroid.LONG);
      return
    }
    this.setState({ loading: true})
    console.log('dddddd')
    Charge({
      cardno: this.refs.codeRef.getRawValue(),
      cardpass: this.state.password
    }).then(data=>{

      ToastAndroid && ToastAndroid.show('充值成功', ToastAndroid.LONG);
      this.setState({ 
        code: '',
        password: '',
        showPassword: false,
        loading: false
      })
      // 存储更新的vip数据
      const vip = {}
      vip.isVip = true
			vip.vipValidTime = data.validTime
      global.vip = vip
      Storage.save('vip', global.vip).then(()=>{
        this.props.navigation.replace('Index')
      })
    }).catch((err)=>{
      console.log('errr', err)
      this.setState({ 
        password: '',
        loading: false
      })
    })
  }

  render() {
    const { navigation, screenProps: { themeColor } } = this.props;
    const { code, password, showPassword } = this.state;
	  return (
        <View>
            <AppTop title="充值" navigation={navigation} showLeftIcon={false} themeColor={themeColor}></AppTop>
            <View style={styles.container}>
              <View style={styles.section}>
                <Text style={styles.title}>请输入10位的密卡号码</Text>
                <TextInputMask
                  type={'custom'}
                  options={{
                    mask: 'SSSS SSSS SS',
                    getRawValue: function(value, settings) {
                      return value.replace(/\s+/g, '')
                    },
                  }}
                  value={this.state.code}
                  onChangeText={text => {
                    this.setState({
                      code: text
                    })
                  }}
                  ref="codeRef"
                  style={ {
                    height: 50,
                    width: '70%',
                    borderColor: themeColor[0],
                    borderBottomWidth: 3,
                    fontSize: 18
                  }}
                />
              </View>
              <View style={styles.section}>
                {
                  !showPassword?(
                    <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={this._checkCode}
                        style={[styles.button_charge, {backgroundColor:  themeColor[0]} ]}
                        activeOpacity={1}>
                        <Text style={{color: 'white'}}>确定</Text>
                      </TouchableOpacity>
                    </View>
                  ):null
                }
              </View>
              {
                showPassword ? (
                  <View style={styles.section}>
                  <Text style={styles.title}>请输入8位的密卡密码</Text>
                  <SmoothPinCodeInput password mask="﹡"
                    cellStyle={{
                      borderBottomWidth: 2,
                      borderColor: 'gray',
                    }}
                    cellStyleFocused={{
                      borderColor: 'black',
                    }}
                    keyboardType={'default'}
                    cellSize={36}
                    codeLength={8}
                    value={password}
                    onTextChange={password => this.setState({ password })}/>
                </View>
                ): null
              }
              <View style={styles.section}>
                {
                  showPassword?(
                    <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity
                        onPress={this.subitForm}
                        style={[styles.button_charge, {backgroundColor:  themeColor[0]} ]}
                        activeOpacity={1}>
                       
                        {this.state.loading ? (
                           <Text style={{color: 'white'}}>充值中...</Text>
                        ) : (
                          <Text style={{color: 'white'}}>确定充值</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ):null
                }
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
    margin: 16,
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
    zIndex: 100,
    marginTop: 20
  },
})