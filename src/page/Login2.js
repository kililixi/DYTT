import React, { PureComponent } from 'react';
import { View, Text} from 'react-native';

import LoginScreen from '../components/Login/LoginScreen';
// import SecondScreen from './SecondScreen';

export default class LoginActivity extends PureComponent {
  render() {
	  return (
        <View>
            <LoginScreen navigation={this.props.navigation}></LoginScreen>
        </View>
	  );
	}
}