import React, { PureComponent } from 'react';
import { View, Text} from 'react-native';

import AppTop from '../components/AppTop';
import RegisterScreen from '../components/Register/RegisterScreen';

export default class Register extends PureComponent {
  render() {
    const { navigation, screenProps: { themeColor } } = this.props;
	  return (
        <View>
          <AppTop title="注册" navigation={navigation} showLeftIcon={false} themeColor={themeColor}></AppTop>
          <RegisterScreen  navigation={navigation} themeColor={themeColor}></RegisterScreen>
        </View>
	  );
	}
}