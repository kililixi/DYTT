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

class DrawerContent extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            Plot: props.state.Plot,
            Status: props.state.Status,
            Area: props.state.Area,
            Year: props.state.Year,
            isVisible:false,
            typeList: []
        }
    }

    setType = (cate, value) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            [cate]: value
        })
    }

    setVisibel = () => {
        /*
        if(this.props.type==='movie'){
            this.setType('isVisible',true);
        }
        */
    }

    onSubmit = () => {
        const { Status, Plot, Area, Year } = this.state;
        const { setType, closeDrawer } = this.props;
        closeDrawer();
        setType({ Status, Plot, Area, Year });
    }

    getCode = async () => {
        // 可以选择的只能是大类下的细类，所以要传albumId，否者结果是全部选项
        const albums = await GetAlbum(this.props.albumId)
        const areas = await GetCountryCode('dycd')
        // 构造查询条件， 分类和地区是后台数据，时间是app构造的
        this.setState({
            typeList: [{
                cate: "Plot",
                icon: "compass",
                name: "分类",
                type: (albums[0].children !=null) ? albums[0].children : null
            },{
                cate: "Area",
                icon: "map-pin",
                name: "分类",
                type: areas
            }, CommonList[1]]
        })
    }

    componentDidMount() {
        this.getCode()
        console.log('albumOptions', this.props.albumOptions);
        
    }

    render() {
        const { themeColor, closeDrawer, type } = this.props;
        const typeList2 = [...Categories[type], ...CommonList];
        // console.log('typeList', typeList)
        const { isVisible, typeList } = this.state;
        console.log('2typeList2222', typeList, typeList2)
        return (
            <Fragment>
                <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.appbar}>
                    <BorderlessButton
                        activeOpacity={.8}
                        style={styles.btn}
                        onPress={closeDrawer}
                    >
                        <Icon name='x' size={22} color='#fff' />
                    </BorderlessButton>
                    <Text style={styles.apptitle} numberOfLines={1} onLongPress={this.setVisibel}>高级筛选</Text>
                </LinearGradient>
                <ScrollView style={styles.content}>
                    {
                        typeList.map((d, i) => (
                            <View key={i} style={styles.typewrap}>
                                <View style={styles.typetitle}>
                                    <Icon name={d.icon} size={16} color={themeColor[0]} />
                                    <Text style={[styles.typetitletxt, { color: themeColor[0] }]}>{d.name}</Text>
                                </View>
                                <View style={styles.typecon}>
                                    <BorderlessButton disabled={this.state[d.cate].id == ''} onPress={() => this.setType(d.cate, {name:'',id:''})} style={styles.typeitem}><Text style={[styles.typeitemtxt, this.state[d.cate].id == '' && { color: themeColor[0] }]}>全部</Text></BorderlessButton>
                                    {
                                        d.type == null ? undefined :d.type.map((el, j) => (
                                            <BorderlessButton disabled={this.state[d.cate].id === el.id} onPress={() => this.setType(d.cate, el)} key={j} style={styles.typeitem}><Text style={[styles.typeitemtxt, el.id == this.state[d.cate].id && { color: themeColor[0] }]}>{el.name}</Text></BorderlessButton>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
                <View style={styles.typeaction}>
                    <TouchableOpacity activeOpacity={.8} onPress={this.onSubmit} style={{ flex: 1 }}>
                        <LinearGradient style={[styles.typebtn,{borderWidth:0}]} colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                            <Text style={styles.typebtns}>确定</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} onPress={closeDrawer} style={[styles.typebtn, { borderColor: themeColor[0] }]}><Text style={[styles.typebtns, { color: themeColor[0] }]}>取消</Text></TouchableOpacity>
                </View>
            </Fragment>
        )
    }
}

const CategoryTop = ({state,type,openDrawer,themeColor}) => (
    <View style={styles.typetop}>
        {
            [...Categories[type], ...CommonList].map((d, i) => (
                <BorderlessButton onPress={openDrawer} style={styles.typetopitem} key={i}>
                    <Icon name={d.icon} size={16} color={themeColor[0]} />
                    <Text style={[styles.typetoptxt, { color: themeColor[0] }]}>{state[d.cate].name || d.name}</Text>
                </BorderlessButton>
            ))
        }
    </View>
)

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

    openDrawer = () => {
        const { Status, Plot, Area, Year } = this.state;
        this.drawer.openDrawer();
        this.drawerContent.setState({ Status, Plot, Area, Year });
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
            const { type } = this.props.navigation.state.params;
            this.type = type;
            this.getData();
            // this.getAreacode();
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
        const { title, type, id } = navigation.state.params;
        const { Status, Plot, Area, Year, isRender, data, isEnding } = this.state;
        return (
            <DrawerLayout
                drawerPosition={DrawerLayout.positions.Right}
                ref={drawer => this.drawer = drawer}
                drawerBackgroundColor="#fff"
                edgeWidth={50}
                onDrawerOpen={this.onDrawerOpen}
                onDrawerClose={this.onDrawerClose}
                drawerWidth={$.WIDTH * .8}
                renderNavigationView={() => <DrawerContent ref={drawer => this.drawerContent = drawer} albumId={id} themeColor={themeColor} closeDrawer={this.closeDrawer} type={type} state={{ Status, Plot, Area, Year }} setType={this.setType} />}
            >
                <View style={[styles.content, styles.bg]}>
                    <AppTop navigation={navigation} themeColor={themeColor} title={title} isBack={true} >
                        <BorderlessButton activeOpacity={.8} style={styles.btn} onPress={this.openDrawer} >
                            <Icon name='filter' size={18} color='#fff' />
                        </BorderlessButton>
                    </AppTop>
                    <CategoryTop openDrawer={this.openDrawer} type={type} state={{ Status, Plot, Area, Year }} themeColor={themeColor} />
                    {
                        isRender ?
                            <MovieList style={{paddingHorizontal:5}} isRender={true} isEnding={isEnding} data={data} navigation={navigation} themeColor={themeColor[0]} onEndReached={this.loadMore} />
                            :
                            <Loading size='small' text='正在努力加载中...' themeColor={themeColor[0]} />
                    }
                </View>
            </DrawerLayout>
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