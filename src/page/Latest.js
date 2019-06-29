/*
*
Search
*
*/

import React, { PureComponent } from 'react';
import {
    Text,
    InteractionManager,
    TextInput,
    LayoutAnimation,
    ScrollView,
    FlatList,
    Image,
    NativeModules,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Loading from '../components/Loading';
import LatestList from '../components/LatestList';
import AnimatedView from '../components/AnimatedView';
import AppTop from '../components/AppTop';
import { GetLatest } from '../../util/api';

const { UIManager } = NativeModules;

class SearchResult extends PureComponent {

    page = 1;

    pageSize = 5;

    state = {
        data: [],
        isRender: false,
        isEnding: false
    }

    componentDidMount() {
        this.mounted = true;
        InteractionManager.runAfterInteractions(() => {
            this.getData();
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getData = async () => {
        const data = await GetLatest({ pageIndex: this.page, pageSize: this.pageSize });
        console.log('searchData', data);
        
        if( this.mounted ){
            LayoutAnimation.easeInEaseOut();
            if (data.isEnd) {
                console.log('search11111');
                
                this.setState({
                    data: [...this.state.data, ...data.list],
                    isEnding: true,
                    isRender: true,
                })
            } else {
                console.log('search2222');
                this.setState({
                    data: [...this.state.data, ...data.list],
                    isRender: true,
                })
                this.page = this.page + 1;
            }
        }
    }

    loadMore = () => {
        if (!this.state.isEnding) {
            this.getData();
        }
    }

    render() {
        const { themeColor,navigation } = this.props;
        const { isRender, data, isEnding } = this.state;
        return (
            <AnimatedView style={[styles.content, styles.bg, styles.full]}>
                {
                    isRender ?
                        <LatestList isRender={true} isEnding={isEnding} data={data} navigation={navigation} themeColor={themeColor} onEndReached={this.loadMore} />
                        :
                        <Loading size='small' text='正在查询中...' themeColor={themeColor} />
                }
            </AnimatedView>
        )
    }
}

export default class Latest extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isRender: false,
            searchList: []
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(async () => {
            const data_search = await GetLatest({pageIndex: this.page, pageSize: this.pageSize })
            console.log('data_search', data_search)
            this.setState({
                isRender: true,
                searchList: data_search
            })
        })
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.searchList !== this.state.searchList) {
            LayoutAnimation.easeInEaseOut();
            // Storage.save('searchList', this.state.searchList);
        }
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { isSearch, searchList, isRender } = this.state;
        return (
            <View style={[styles.content, styles.bg]}>
                <AppTop title="最新" navigation={navigation} showLeftIcon={false} themeColor={themeColor}>
                </AppTop>
                <View style={styles.content}>
                    {
                        // isSearch &&
                        <SearchResult ref={node => this.searchcon = node} navigation={navigation} themeColor={themeColor[0]} />
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    bg: {
        backgroundColor: '#f7f7f7'
    },
    top: {
        paddingTop: $.STATUS_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editbtn:{
        height:'100%',
        paddingHorizontal:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchcon: {
        flexDirection: 'row',
        borderRadius: 20,
        height: 34,
        flex: 1,
        marginVertical: 7,
        //marginHorizontal:10,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    searchtext: {
        flex: 1,
        height: 34,
        //marginHorizontal: 5,
        paddingVertical: 0,
        fontSize: 14,
        paddingLeft: 10,
        alignItems: 'center',
        color: '#666',
        backgroundColor: 'transparent',
    },
    full: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
    },
    view_hd: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    view_title: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
        flex: 1
    },
    search_h_list: {
        padding: 10,
        paddingTop: 0,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    search_h_item: {
        backgroundColor: '#fff',
        height: 30,
        paddingHorizontal: 15,
        borderRadius: 15,
        justifyContent: 'center',
        flexDirection:'row',
        alignItems:'center',
        marginRight: 10,
        marginBottom: 10
    },
    search_h_el: {
        maxWidth: 120,
        fontSize: 14,
        color: '#666'
    },
    search_h_null: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        padding: 20,
    },
    flexcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666'
    }
})