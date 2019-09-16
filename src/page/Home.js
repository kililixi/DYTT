import React, { PureComponent,Fragment } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity,LayoutAnimation,NativeModules, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from '../components/Swiper';
import MovieTitle from '../components/MovieTitle';
import MovieList from '../components/MovieList';
import MovieMoreBtn from '../components/MovieMoreBtn'
import {GetHomeData, GetHomeData2} from '../../util/api';

const {UIManager} = NativeModules;
const { width, height } = Dimensions.get('window');

const mapto = (list,maps) => {
    const data = {};
    list.forEach(d=>{
        maps.forEach(el=>{
            !data[el.listType]&&(data[el.listType]={
                name:'',
                list:[]
            });
            if(el.listType===d.listType){
                !data[el.listType].name&&(data[el.listType].name = el.name);
                data[el.listType].list.push(d);
            }
        })
    })
    return data;
}

const numColumns = 4;
export default class Home extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            headers: [],
            data:{}
        }
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

    GetHomeData = async () => {
        // const data2 = await GetHomeData();
        const data = await GetHomeData2();
        console.log('data', data)
        const headers = Object.keys(data).filter( v => v !== 'scrolling').map(v=>{
            return {
                id: v,
                name: data[v].name,
                listType: 'movie' // 其实没用，但是要写
            }
        })
        // this.props._setTab(headers);
        console.log('keystitle:', headers)
        this.props._setTab(headers);
        if(this.mounted){
            LayoutAnimation.easeInEaseOut();
            this.setState({
                data,
                headers: headers,
                loading:false
            })
        }
        this.props._onHomeRefreshEnd()
    }

    _refresh() {
        console.log('Home Refresh')
        this.GetHomeData();
    }

    componentDidMount() {
        this.mounted = true;
        this.GetHomeData();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    goDetail = (params) => () => {
        this.props.navigation.navigate('MovieContent',params);
    }

    _renderItem = ({item}) => {
        const {screenProps:{themeColor}} = this.props;
        return (
            <TouchableOpacity style={styles.linkitem} activeOpacity={.9} onPress={this.goDetail({type:item.listType,title:item.name,id:item.id})} >
                <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linkicon}><Icon name={'film'} color={'#fff'} size={16} /></LinearGradient>
                <Text style={styles.linktext}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {loading,data={}, headers=[]} = this.state;
        const {navigation,screenProps:{themeColor}} = this.props;
        console.log('headerssss', headers)
        return (
            <ScrollView style={styles.content}>
            <Swiper loading={loading} data={data.scrolling&&data.scrolling.list} navigation={navigation} themeColor={themeColor[0]} />
            <View style={styles.links}>
                {
                    <FlatList
                        data={headers}
                        numColumns={numColumns}
                        renderItem={this._renderItem}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index}
                    />
                    //  headers.map((d,i)=>(
                    //     <TouchableOpacity key={i} style={styles.linkitem} activeOpacity={.9} onPress={this.goDetail({type:d.listType,title:d.name,id:d.id})} >
                    //         <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linkicon}><Icon name={'film'} color={'#fff'} size={16} /></LinearGradient>
                    //         <Text style={styles.linktext}>{d.name}</Text>
                    //     </TouchableOpacity>
                    // ))
                    // maps.filter(el=>!el.isRender).map((d,i)=>(
                    //     <TouchableOpacity key={i} style={styles.linkitem} activeOpacity={.9} onPress={this.goDetail({type:d.listType,title:d.name,id:d.id})} >
                    //         <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linkicon}><Icon name={d.icon} color={'#fff'} size={16} /></LinearGradient>
                    //         <Text style={styles.linktext}>{d.name}</Text>
                    //     </TouchableOpacity>
                    // ))
                }
            </View>
            {
                 headers.map((d,i)=>(
                    <Fragment key={i}>
                        <MovieTitle title={d.name} icon={'film'} themeColor={themeColor[0]} />
                        <MovieList isRender={!loading} style={{marginTop:-10}} data={data[d.id]?data[d.id]['list']:[]} navigation={navigation} themeColor={themeColor[0]} />
                        <MovieMoreBtn show={!loading} text={"查看更多"+d.name} onPress={this.goDetail({type:d.listType,title:d.name, id: d.id })} />
                    </Fragment>
                ))
                // maps.filter(el=>!el.isRender).map((d,i)=>(
                //     <Fragment key={i}>
                //         <MovieTitle title={d.name} icon={d.icon} themeColor={themeColor[0]} />
                //         <MovieList isRender={!loading} style={{marginTop:-10}} data={data[d.listType]?data[d.listType]['list']:[]} navigation={navigation} themeColor={themeColor[0]} />
                //         <MovieMoreBtn show={!loading} text={"查看更多"+d.name} onPress={this.goDetail({type:d.listType,title:d.name, id: d.id })} />
                //     </Fragment>
                // ))
            }
        </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
	content: {
        flex: 1,
    },
    links:{
        borderRadius:5,
        backgroundColor:'#fff',
        overflow:'hidden',
        marginHorizontal:10,
        padding:10,
        marginTop:-25,
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    linkitem:{
        width: (width-20)/numColumns,
        alignItems:'center',
        justifyContent: 'center'
    },
    linkicon:{
        width:40,
        height:40,
        borderRadius:40,
        backgroundColor:'#fff',
        justifyContent: 'center',
		alignItems: 'center',
    },
    linktext:{
        marginTop:5,
        fontSize:12,
    },
    links2:{
        borderRadius:5,
        backgroundColor:'#fff',
        overflow:'hidden',
        margin:10,
        padding:10,
        marginTop:-20
    }
});
