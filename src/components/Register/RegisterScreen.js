import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ToastAndroid
} from "react-native";

import { StackNavigator } from "react-navigation";

import UserInput from '../Login/UserInput';
import bgSrc from '../../img/mine/wallpaper.png';
import {Register, Login, GetSession} from '../../../util/api'
import Storage from '../../../util/storage';

const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/
const usernameReg = /^[a-zA-Z0-9_-]{4,16}$/
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

import spinner from '../../img/mine/loading.gif';
export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      isLoading: false
    };
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    }
  };

  async onRegisterPress() {
    if (this.state.isLoading) return;
   
    const { email, password, name, password_confirmation } = this.state;
    if(name === '') {
      ToastAndroid && ToastAndroid.show('(oﾟ▽ﾟ)o  用户名不能为空', ToastAndroid.LONG);
      return
    } else {
      if(!usernameReg.test(name)) {
        ToastAndroid && ToastAndroid.show('用户名必须由4到16位的字母或数字、下划线、减号组成', ToastAndroid.LONG);
        return
      }
    }
    if(email === '') {
      ToastAndroid && ToastAndroid.show('(oﾟ▽ﾟ)o  邮箱不能为空', ToastAndroid.LONG);
      return
    }
    if(emailReg.test(password)) {
      ToastAndroid && ToastAndroid.show('密码必须由6到16位的数字、字母、下划线组成', ToastAndroid.LONG);
      return
    }
    if(password !== password_confirmation) {
      ToastAndroid && ToastAndroid.show('(oﾟ▽ﾟ)o  两次密码输入不一致', ToastAndroid.LONG);
      return
    }
    this.setState({isLoading: true});
    Register({
      loginAccount: name,
      loginPass: password,
      userEmail: email
    }).then(data=>{
      // 登陆
      Login({
        username: name,
        password: password
      }).then(data=>{
        global.token = data.data.token
        // 获取用户信息
        GetSession().then(userdata => {
          this.setState({isLoading: false});
          console.log('userdata', userdata)
          global.userInfo = userdata.user
          Storage.save('token', global.token);
          Storage.save('userInfo', global.userInfo);
          
          ToastAndroid && ToastAndroid.show(`欢迎,${userdata.user.loginAccount}`, ToastAndroid.SHORT);
          this.props.navigation.replace('Index')
        })
      })

    }).catch(e=>{
      // ToastAndroid && ToastAndroid.show('(oﾟ▽ﾟ)o  出了一点问题...', ToastAndroid.LONG);
      this.setState({isLoading: false});
    })
    
  }

  render() {
    const {themeColor} = this.props
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={bgSrc}>
        <View behavior="padding" style={styles.container}>
          <KeyboardAvoidingView>
            <TextInput
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
              style={styles.input}
              placeholder="请输入用户名"
              placeholderTextColor="#c5c4c2"
              returnKeyType="next"
              onSubmitEditing={() => this.emailInput.focus()}
            />
          
            <TextInput
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              style={styles.input}
              placeholderTextColor="#c5c4c2"
              returnKeyType="next"
              ref={input => (this.emailInput = input)}
              onSubmitEditing={() => this.passwordCInput.focus()}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="请输入邮箱"
            />
          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            placeholder="请输入密码"
            secureTextEntry={true}
            placeholderTextColor="#c5c4c2"
            ref={input => (this.passwordCInput = input)}
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType="next"
            secureTextEntry
          />
          <TextInput
            value={this.state.password_confirmation}
            onChangeText={password_confirmation => this.setState({ password_confirmation })}
            style={styles.input}
            placeholder="请再输入一次密码"
            secureTextEntry={true}
            placeholderTextColor="#c5c4c2"
            returnKeyType="go"
            secureTextEntry
            ref={input => (this.passwordInput = input)}
          />
          </KeyboardAvoidingView>
          <TouchableOpacity
            onPress={this.onRegisterPress.bind(this)}
            style={[styles.button, {
              backgroundColor: themeColor[0]
            }]}
          >
             {this.state.isLoading ? (
               <Text style={styles.buttonText}>注册中...</Text>
            ) : (
              <Text style={styles.buttonText}>完成注册并登陆</Text>
            )}
            
            </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 20,
    paddingTop: 10,
    width: '100%', 
    height: '100%'
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 150
  },
  input: {
    height: 40,
    width: 350,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#000",
    paddingHorizontal: 10
  },
  button: {
    height: 50,
    // backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  subtext: {
    color: "#ffffff",
    width: 160,
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 20
  },
  image: {
    width: 24,
    height: 24,
  }
});