/**
 * AppBar
 */

import React, { PureComponent } from 'react';
import { DrawerItems } from 'react-navigation';
import Storage from '../../util/storage';
import {
	StyleSheet,
    Text,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity,
	View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Login from './Login';
import { Store } from '../../util/store';

const contentOptions = {
    itemsContainerStyle :{
        paddingVertical:0
    },
    labelStyle:{
        marginLeft:0,
        fontSize:16,
        fontWeight:'normal'
    },
    itemStyle:{

    }
}

export default class DrawerContent extends PureComponent {

    getLoginToken = async () => {
        const data = await Storage.get('token');
        console.log('开始测试', data)
        if(!data) {
            console.log('未登录，')
            Storage.save('token','abc');
        } else {
            console.log('已登录', data)
        }
		
    }
    
    componentDidMount() {
        //console.warn(this.props)
        this.getLoginToken()
    }

	render() {
        console.log('this.props', this.props);
        
        const { historyList:[LatestItem] } = this.context;
		const { themeColor } = this.props.screenProps;
		return (
            <ScrollView style={{flex:1}}>
                <ImageBackground source={require('../img/photo.jpg')} style={[styles.top,{backgroundColor:themeColor[0]}]}>
                    {
                        LatestItem&&
                        <BorderlessButton style={styles.item} activeOpacity={.8} onPress={()=>this.props.navigation.navigate('MovieDetail',{movieId:LatestItem.id})}>
                            {
                                //<Image resizeMode="cover" style={styles.cover} source={{uri:LatestItem.img}} />
                            }    
                        </BorderlessButton>
                    }
                </ImageBackground>
                <DrawerItems {...this.props} {...contentOptions} inactiveTintColor="#333" activeTintColor={themeColor[0]} />
            </ScrollView>
			
		);
	}
}

DrawerContent.contextType = Store;

const styles = StyleSheet.create({
	top: {
        height:$.WIDTH*.7,
		flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item:{
        width:'100%',
        height:'100%',
    },
    cover:{
        position:'absolute',
        left:0,
        top:0,
        right:0,
        bottom:0,
        opacity:.5
    },
    name:{
        color:'#fff',
        fontSize:16
    }
});
