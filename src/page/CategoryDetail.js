/*
*
MovieContent
*
*/

import React, { PureComponent, Fragment } from 'react';
import {
    BackHandler,
    InteractionManager,
    NativeModules,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    Text,
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppTop from '../components/AppTop';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import { GetPageList2, GetPageList, GetCountryCode, GetAlbum } from '../../util/api';
import  { CommonList,Categories } from '../../util/categories';
const { UIManager } = NativeModules;


export default class extends PureComponent {

    page = 1;

    pageSize = 50;

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            data: [],
            albumOptions: [],
            isRender: false,
            isEnding: false,
            Status: {
                name:'',
                id:''
            },
            Plot: {
                name:'',
                id:''
            },
            Area: {
                name:'',
                id:''
            },
            Year: {
                name:'',
                id:''
            }
        }
    }

    closeDrawer = () => {
        this.drawer.closeDrawer();
    }

    setType = (options) => {
        LayoutAnimation.easeInEaseOut();
        this.setState(options,this.regetData);
    }

    regetData = () => {
        this.page = 1;
        this.setState({
            isRender: false,
            isEnding: false,
            data: []
        }, this.getData)
    }

    getData = async () => {
        const { Status, Plot, Area, Year } = this.state;
        const {id} = this.props.navigation.state.params
        // 默认是大类，比如电影、动漫，除非用户选择了某种类型
        const albumId = Plot.id || id
        console.log('MovieContent ID', Plot, id);
        const data = await GetPageList2({ pageIndex: this.page, pageSize: this.pageSize, id: albumId, Type:this.type, Status:Status.id, Area:Area.id, Plot:Plot.id, Year:Year.id,orderBy:'addtime' });
        console.log('MovieContent', data);
        
        if(this.mounted){
            LayoutAnimation.easeInEaseOut();
            this.setState({
                data: [...this.state.data, ...data],
                isRender: true,
            })
            if (data.length < 25) {
                this.setState({
                    isEnding: true
                })
            } else {
                this.page = this.page + 1;
            }
        }
    }

    loadMore = () => {
        if (!this.state.isEnding) {
            this.getData();
        }
    }

    onDrawerOpen = () => {
        this.open = true;
    }

    onDrawerClose = () => {
        this.open = false;
    }

    onBackAndroid = () => {
        if(this.open){
            this.closeDrawer();
            return true;
        }
    }

    componentWillMount() {
        this.mounted = true;
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        InteractionManager.runAfterInteractions(() => {
            this.getData();
        })
    }

    componentWillUnmount() {
        this.mounted = false;
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('handwareBackPress', this.onBackAndroid)
        }
    }

    render() {
        const { navigation, screenProps: { themeColor } } = this.props;
        const { title } = navigation.state.params;
        const { isRender, data, isEnding } = this.state;
        return (
                <View style={[styles.content, styles.bg]}>
                    <AppTop navigation={navigation} themeColor={themeColor} title={title} isBack={true} >
                        <BorderlessButton activeOpacity={.8} style={styles.btn} >
                            <Icon name='filter' size={18} color='#fff' />
                        </BorderlessButton>
                    </AppTop>
                    {
                        isRender ?
                            <MovieList style={{paddingHorizontal:5}} isRender={true} isEnding={isEnding} data={data} navigation={navigation} themeColor={themeColor[0]} onEndReached={this.loadMore} />
                            :
                            <Loading size='small' text='正在努力加载中...' themeColor={themeColor[0]} />
                    }
                </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    bg: {
        backgroundColor: '#f7f7f7',
    },
    appbar: {
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
    apptitle: {
        flex: 1,
        fontSize: 16,
        color: '#fff'
    },
    typewrap: {
        padding: 10,
        paddingBottom: 0
    },
    typetitle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 40
    },
    typetitletxt: {
        fontSize: 15,
        paddingLeft: 10,
        color: '#333',
    },
    typecon: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    typeitem: {
        paddingHorizontal: 10,
        marginRight: 5,
        marginBottom: 5,
        height: 30,
        justifyContent: 'center'
    },
    typeitemtxt: {
        fontSize: 14,
        color: '#666'
    },
    typetop: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    typetopitem: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    typetoptxt: {
        fontSize: 14,
        paddingLeft: 5,
    },
    typeaction: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        flexDirection: 'row',
    },
    typebtn: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    typebtns: {
        fontSize: 14,
        color: '#fff'
    }
})