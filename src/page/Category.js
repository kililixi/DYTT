import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BorderlessButton } from 'react-native-gesture-handler';
import Scrollviewpager from '../components/Scrollviewpager';
import AppTop from '../components/AppTop';
import Separator from '../components/Separator'
import Icon from 'react-native-vector-icons/Feather';

const maps = [
    [
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
    ],
    [
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
]

export default class Category extends PureComponent {
    render() {
        const {navigation,screenProps:{themeColor}} = this.props;
        return (
            <View style={styles.container}>
                <AppTop title="分类" navigation={navigation} showLeftIcon={false} themeColor={themeColor}>
                </AppTop>

                <View>
                    {
                        maps.map((item, m)=>(
                            <View key={m}>
                                <TouchableOpacity style={[styles.huiyuanBtn]} activeOpacity={.8}>
                                    <Text style={[styles.text,{color: themeColor[0]}]}>黄金</Text>
                                </TouchableOpacity>
                                <View style={styles.links}>
                                    {
                                        item.filter(el=>!el.isRender).map((d,i)=>(
                                            <TouchableOpacity key={i} style={styles.linkitem} activeOpacity={.9} >
                                                <LinearGradient colors={themeColor.length>1?themeColor:[...themeColor,...themeColor]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linkicon}><Icon name={d.icon} color={'#fff'} size={16} /></LinearGradient>
                                                <Text style={styles.linktext}>{d.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                                <Separator />
                            </View>
                        ))
                    }
                </View>
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
});