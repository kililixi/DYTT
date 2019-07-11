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

import AnimatedView from '../components/AnimatedView';
import AppTop from '../components/AppTop';
import Loading from '../components/Loading';
import LoadView from '../components/LoadView';
import ChargeDetail from '../components/ChargeCell'
const { UIManager } = NativeModules;
import { GetChargeHistory } from '../../util/api';

class History extends PureComponent {

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
        const data = await GetChargeHistory({ pageIndex: this.page, pageSize: this.pageSize });
        console.log('searchData', data);
        
        if( this.mounted ){
            LayoutAnimation.easeInEaseOut();
            if (data.last) {
                console.log('search11111');
                this.setState({
                    data: [...this.state.data, ...data.content],
                    isEnding: true,
                    isRender: true,
                })
            } else {
                console.log('search2222');
                this.setState({
                    data: [...this.state.data, ...data.content],
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

    renderItem = ({ item, index }) => {
        // return <Text>{item.cardno}</Text>
        console.log('data', item)
        return <ChargeDetail remark={item.remark} themeColor={ this.props.themeColor} chargeValidTime={item.chargeValidTime} createTime={item.createTime} key={item.id} />
    }
    
    renderFooter = () => {
        const { themeColor } = this.props
        const { isEnding=false} = this.state
		return <LoadView isEnding={isEnding} themeColor={themeColor} />;
	}

    render() {
        const { themeColor,navigation } = this.props;
        const { isRender, data, isEnding } = this.state;
        console.log('dataaaaaaa', data)
        return (
            <AnimatedView style={[styles.content, styles.bg, styles.full]}>
                {
                    isRender ? (
                        <FlatList
                            style={[styles.content]}
                            numColumns={1}
                            ItemSeparatorComponent={() => <View style={{height:10}} />}
                            ListFooterComponent={this.renderFooter}
                            data={data}
                            // getItemLayout={(data, index) => ( {length: height, offset: height * index, index} )}
                            onEndReached={this.loadMore}
                            onEndReachedThreshold={0.1}
                            keyExtractor={(item, index) => index+item.id.toString()}
                            renderItem={this.renderItem}
                        />
                    )
                        :
                        <Loading size='small' text='正在查询中...' themeColor={themeColor} />
                }
            </AnimatedView>
        )
    }
}

export default class ChargeHistory extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(async () => {
        //     const data_search = await GetChargeHistory({pageIndex: this.page, pageSize: this.pageSize })
        //     console.log('data_search', data_search)
        //     this.setState({
        //         isRender: true,
        //         chargeList: data_search
        //     })
        // })
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        return (
            <View style={[styles.content, styles.bg]}>
                <AppTop title="充值历史" navigation={navigation} showLeftIcon={false} themeColor={themeColor}>
                </AppTop>
                <View style={styles.content}>
                    <History themeColor={themeColor}></History>
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