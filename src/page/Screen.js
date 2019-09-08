import React, { PureComponent } from 'react';
import { 
    View,
    InteractionManager,
    LayoutAnimation,
    StyleSheet,
    NativeModules
} from 'react-native';

import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import MovieMoreBtn from '../components/MovieMoreBtn';
import { GetPageList, GetPageList2 } from '../../util/api';

const { UIManager } = NativeModules;

export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            data:[],
            isRender:false,
        }
    }

    getData = async () => {
        // const data = await GetPageList({ pageIndex: 1, pageSize: 30, Type:this.type });
        const data = await GetPageList2({ page: 1, size: 10, Type:this.type, id: this.id });
        console.log('Screen', this.mounted)
        if(this.mounted){
            LayoutAnimation.easeInEaseOut();
            this.setState({
                data: data,
                isRender: true,
            })
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.mounted = true;
            const { type, id } = this.props;
            this.type = type;
            this.id = id; // 设置类型的id,现在是先写死
            this.getData();
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    ListFooterComponent = () => {
        const { navigation,type,tablabel,id } = this.props;
        return <View style={{paddingBottom:10}}><MovieMoreBtn text="查看更多" show={true} style={{marginHorizontal:5}} onPress={()=>navigation.navigate('MovieContent',{type:type,title:tablabel, id:id})} /></View>;
    }

    render() {
        const { isRender, data } = this.state;
        const { navigation, screenProps: { themeColor } } = this.props;
        return (
            <View style={styles.container}>
                {
                    isRender ?
                        <MovieList style={{paddingHorizontal:5}} isRender={true} ListFooterComponent={this.ListFooterComponent} data={data} navigation={navigation} themeColor={themeColor[0]} onEndReached={this.loadMore} />
                        :
                        <Loading size='small' text='正在努力加载中...' themeColor={themeColor[0]} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
});