import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Scrollviewpager from './components/Scrollviewpager';
import AppTop from './components/AppTop';
import Home from './page/Home';
import Screen from './page/Screen';
import Icon from 'react-native-vector-icons/Feather';

const tablist = [
    {
        type: 'movie',
        name: '电影',
        id: '9f0c3c70-9fdc-4658-a174-0259429af4df'
    },
    {
        type: 'tv',
        name: '电视剧',
        id: '193e6f7f-ecc1-45b3-b4eb-ee068fba3f5b'
    },
    {
        type: 'comic',
        name: '动漫',
        id: '9aa93955-8b5f-4e42-ac2f-ed7f9978ec23'
    },
    {
        type: 'variety',
        name: '综艺',
        id: 'c7c9116e-3ddd-4da0-8e08-f248177ecd55'
    }
]

export default class TabNavigator extends PureComponent {
    static navigationOptions = {
        drawerLabel: '首页',
        drawerIcon: ({ tintColor }) => (
            <Icon name='home' size={18} color={tintColor} />
        ),
    };
    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        return (
            <View style={styles.container}>
                <AppTop title="爱看视频" navigation={navigation} themeColor={themeColor}>
                    {
                        /*
                        <Touchable
                            style={styles.btn}
                            onPress={()=>navigation.navigate('History')}
                        >
                            <Icon name='clock' size={20} color='#fff' />
                        </Touchable>
                        */
                    }
                    <BorderlessButton activeOpacity={.8} style={styles.btn} onPress={()=>navigation.navigate('Search')} >
                        <Icon name='search' size={20} color='#fff' />
                    </BorderlessButton>
                </AppTop>
                <Scrollviewpager themeColor={themeColor[0]}>
                    <Home tablabel="首页" {...this.props} />
                    {
                        tablist.map(el => <Screen id={el.id} key={el.type} type={el.type} tablabel={el.name} {...this.props} />)
                    }
                </Scrollviewpager>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});