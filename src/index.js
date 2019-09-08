import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Scrollviewpager from './components/Scrollviewpager';
import AppTop from './components/AppTop';
import Home from './page/Home';
import Screen from './page/Screen';
import Icon from 'react-native-vector-icons/Feather';
import Dimensions from 'Dimensions';

const {width, height} = Dimensions.get('window');

import { GetIndexAlbum } from '../util/api';

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

    constructor(props) {
        super(props)
        this.state = {
          tabs: [],
          refreshing: false,
          mounted: false // TODO 如果在Scrollviewpager（下面）的tab采用state里的值，在state变更后虽然渲染没问题，但是切换到新渲染的tab的时候，没有内容显示。如果一开始就用静态变量渲染，就没问题，这里先强制读取tab数据后再渲染 Scrollviewpager...
        }
    }
    
    GetIndexAlbum = async () => {
        const data = await GetIndexAlbum() 
        console.log('index data', data)
        if(this.mounted){
            this.setState({
                tabs: data,
                mounted: true
            })
        }
    }

    componentDidMount() {
        console.log('width', width, height)
        this.mounted = true
        this.GetIndexAlbum();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _setTab(tabs) {
        // this.setState({
        //     tabs: tabs,
        //     mounted: true
        // });
    }

    _onRefresh() {
        //下拉刷新的代码
        console.log('refersh!!!!')
        this.home._refresh()
        this.setState({
            refreshing: true
        })
     }

     _onHomeRefreshEnd() {
        console.log('refersh end!!!')
        //下拉刷新的代码
        this.setState({
            refreshing: false
        })
     }
  
    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        const { tabs, mounted } = this.state
        const type = 'movie' // 
        return (
            <View style={styles.container}>
                <ScrollView
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                        title={'下拉刷新'}
                        refreshing={this.state.refreshing}
                        colors={['rgb(255, 176, 0)',"#ffb100"]}
                        onRefresh={() => {
                            this._onRefresh();
                        }}
                        />
                    }
                >
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
                   <Home ref={(view)=>this.home=view} tablabel="首页" {...this.props} _onHomeRefreshEnd={this._onHomeRefreshEnd.bind(this)}  _setTab={this._setTab.bind(this)}/>
                    {/* {
                        tabs.map(el => <Screen id={el.id} key={el.id} type={type} tablabel={el.name} {...this.props} />)
                    } */}
                </ScrollView>
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