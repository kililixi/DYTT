import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BorderlessButton } from 'react-native-gesture-handler';
import Scrollviewpager from '../components/Scrollviewpager';
import AppTop from '../components/AppTop';
import Separator from '../components/Separator'
import Icon from 'react-native-vector-icons/Feather';
import {GetAlbumByLevel} from '../../util/api'

const maps = [{
    code: 'gold',
    name: '黄金会员专属',
    content: [
        {
            listType:'scrolling',
            name:'轮播图',
            isRender:true
        },
        {
            listType:'movie',
            name:'电影',
            icon:'film',
            id: '9f0c3c70-9fdc-4658-a174-0259429af4df'
        },
        {
            listType:'tv',
            name:'电视剧',
            icon:'tv',
            id: '193e6f7f-ecc1-45b3-b4eb-ee068fba3f5b'
        },
        {
            listType:'comic',
            name:'动漫',
            icon:'gitlab',
            id: '9aa93955-8b5f-4e42-ac2f-ed7f9978ec23'
        },
        {
            listType:'variety',
            name:'娱乐',
            icon:'anchor',
            id: 'c7c9116e-3ddd-4da0-8e08-f248177ecd55'
        },
    ]
}, {
    code: 'silver',
    name: '白银会员专属',
    content: [
        {
            listType:'scrolling',
            name:'轮播图',
            isRender:true
        },
        {
            listType:'movie',
            name:'电影',
            icon:'film',
            id: '9f0c3c70-9fdc-4658-a174-0259429af4df'
        },
        {
            listType:'tv',
            name:'电视剧',
            icon:'tv',
            id: '193e6f7f-ecc1-45b3-b4eb-ee068fba3f5b'
        },
        {
            listType:'comic',
            name:'动漫',
            icon:'gitlab',
            id: '9aa93955-8b5f-4e42-ac2f-ed7f9978ec23'
        },
        {
            listType:'variety',
            name:'娱乐',
            icon:'anchor',
            id: 'c7c9116e-3ddd-4da0-8e08-f248177ecd55'
        },
    ]
}]

const numColumns = 5;
const { width, height } = Dimensions.get('window');

export default class Category extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            data:[]
        }
	}

    goDetail = (params) => () => {
        this.props.navigation.navigate('CategoryDetail',params);
    }

    GetAlbum = async () => {
        const data = await GetAlbumByLevel();
        // const transferData = data.map( v=> {
            
        //     const transferData = []
        //     for(let i=0,len= v.content.length; i<len; i+=4 ){
        //         transferData.push( v.content.slice(i,i+4));
        //     }
        //     v.content2 = transferData

        // })
        // console.log('data', data)
        if(this.mounted){
            this.setState({
                data,
                loading:false
            })
        }
    }
    
    componentDidMount() {
        this.mounted = true;
        this.GetAlbum();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        return (
            <View style={styles.container}>
                <AppTop title="分类" navigation={navigation} showLeftIcon={false} themeColor={themeColor}>
                </AppTop>

                <View>
                    {
                        this.state.data.map((item, m)=>(
                            <View key={m}>
                                <TouchableOpacity style={[styles.huiyuanBtn]} activeOpacity={.8}>
                                    <Text style={[styles.text,{color: themeColor[0]}]}>{item.name}</Text>
                                </TouchableOpacity>
                                <Separator />
                                <FlatList
                                    themeColor={themeColor.length>1?themeColor:[...themeColor,...themeColor]}
                                    data={item.content}
                                    numColumns={numColumns}
                                    renderItem={this._renderItem}
                                    style={{backgroundColor: '#fff'}}
                                    scrollEnabled={false}
                                    keyExtractor={(item, index) => index}
                                />
                                {/* {
                                    item.content2.map((sub, s)=>(
                                        <View style={styles.links} key={s}>
                                        {
                                            sub.filter(el=>!el.isRender).map((d,i)=>(
                                                <TouchableOpacity key={i} style={styles.linkitem} activeOpacity={.9} onPress={this.goDetail({type:d.listType,title:d.name,id:d.id})} >
                                                    <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linkicon}><Icon name={d.icon} color={'#fff'} size={16} /></LinearGradient>
                                                    <Text style={styles.linktext}>{d.name}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                        </View>
                                    ))
                                } */}
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    _renderItem = ({item}) => {
        // console.log('thisprops', this.props)
        const {screenProps:{themeColor}} = this.props;
        return (
            <TouchableOpacity 
                activeOpacity={0.7}
                style={styles.item}
                onPress={this.goDetail({type:item.listType,title:item.name,id:item.id})}
            >
               <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linkicon}><Icon name={item.icon} color={'#fff'} size={16} /></LinearGradient>
                <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
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
    links:{
        borderRadius:5,
        backgroundColor:'#fff',
        overflow:'hidden',
        padding:10,
        flexDirection:'row'
    },
    linkitem:{
        flex:1,
        alignItems:'center'
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
    text:{
        paddingLeft: 48,
        fontSize:14,
        color:'#666'
    },
    huiyuanBtn:{
        marginTop:10,
        height:40,
        backgroundColor:'#fff',
        justifyContent: "center",
        alignItems: 'flex-start',
        borderRadius:3,
        overflow:'hidden'
    },
    item: {
        backgroundColor: '#fff',
        width: width/numColumns,
        height: 80,  
        alignItems: 'center',
        justifyContent: 'center',
    },
});