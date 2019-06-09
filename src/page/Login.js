import React, { PureComponent } from 'react';
import {
  ToolbarAndroid,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';
import EditView from '../components/EditView';
// import LoginSuccess from '../ui/LoginSuccess';
export default class LoginActivity extends PureComponent {
  constructor(props) {
    super(props);
    this.userName = "";
    this.password = "";
  }

  render() {
      console.log('loginggggggggggg');
      
      return (

    <View style={LoginStyles.loginview}>
     <View   style={{flexDirection: 'row',height:100,marginTop:1,
        justifyContent: 'center',
        alignItems: 'flex-start',}}>
       {/* <Image source={require('../img/photo.jpg')}/> */}
     </View>
     <View style={{marginTop:80}}>
       <EditView  name='输入用户名/注册手机号' onChangeText={(text) => {
            this.userName = text;
        }}/>
       <EditView name='输入密码' onChangeText={(text) => {
            this.password = text;
        }}/>
        {/* <LoginButton name='登录' onPressCallback={this.onPressCallback}/> */}
        <Text style={{color:"#4A90E2",textAlign:'center',marginTop:10}} >忘记密码？</Text>
      </View>
     </View>
   )
  }


  onPressCallback = () => {
    let formData = new FormData();
    formData.append("loginName",this.userName);
    formData.append("pwd",this.password);
    let url = "http://localhost:8080/loginApp";
    NetUitl.postJson(url,formData,(responseText) => {
          alert(responseText);
          this.onLoginSuccess();
    })


  };

  //跳转到第二个页面去
    onLoginSuccess(){
     const { navigator } = this.props;
     if (navigator) {
       navigator.push({
         name : 'LoginSuccess',
         component : LoginSuccess,
       });
     }
   }

}

class loginLineView extends PureComponent {
  render() {
    return (
        <Text >
            没有帐号
          </Text>
    );
  }
}

const LoginStyles = StyleSheet.create({
  loginview: {
    flex: 1,
    padding: 30,
      backgroundColor: '#ffffff',
  },
});