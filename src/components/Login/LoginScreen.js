import React, {Component} from 'react';
import Logo from './Logo';
import Form from './Form';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
import Storage from '../../../util/storage';
import {StyleSheet, ImageBackground, ToastAndroid} from 'react-native';
import {Login, GetSession} from '../../../util/api'


import bgSrc from '../../img/mine/wallpaper.png';
// let global = require('../../../util/global');
export default class LoginScreen extends Component {

  submitLogin = () => {
    const {username, password} = this.refs.loginForm.getFormData()
    if(username === '' || password === '') {
      ToastAndroid && ToastAndroid.show('(oﾟ▽ﾟ)o  用户名或密码不能为空', ToastAndroid.LONG);
      return;
    }
    Login({
      username: username,
      password: password
    }).then(data=>{
      global.token = data.data.token
      // 获取用户信息
      GetSession().then(userdata => {
        console.log('userdata', userdata)
        const vip = {}
        vip.isVip = userdata.isVip
        vip.vipValidTime = userdata.valid
        global.vip = vip

        global.userInfo = userdata.user
        Storage.save('token', global.token);
        Storage.save('userInfo', global.userInfo);
        Storage.save('vip', global.vip);
        this.refs.buttonSubmit.closeLoading()
        ToastAndroid && ToastAndroid.show(`欢迎回来,${userdata.user.loginAccount}`, ToastAndroid.SHORT);
        this.props.navigation.replace('Index')
      }).catch(()=>{
        this.refs.buttonSubmit.closeLoading()
      })
    }).catch(()=>{
      this.refs.buttonSubmit.closeLoading()
    })
  }
  render() {
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={bgSrc}>
        <Logo />
        <Form ref="loginForm" />
        <SignupSection />
        <ButtonSubmit ref="buttonSubmit" submitLogin={this.submitLogin}/>
      </ImageBackground>
    );
  }
}
