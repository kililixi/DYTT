/**
 * DYTT 电影天堂
 * https://github.com/XboxYan/DYTT
 *
 * @XboxYan
 * @yanwenbin1991@live.com
 */
import './util/global';
import React,{ PureComponent } from 'react';
import { StatusBar, BackHandler, Platform, ToastAndroid, NetInfo } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createBottomTabNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import SplashScreen from 'react-native-splash-screen';
import Index from './src';
import MovieDetail from './src/page/MovieDetail';
import MovieContent from './src/page/MovieContent';
import Comment from './src/page/Comment';
import DrawerContent from './src/page/DrawerContent';
import History from './src/page/History';
import Theme,{themes,themesGradient} from './src/page/Theme';
import Follow from './src/page/Follow';
import Search from './src/page/Search';
import Setting from './src/page/Setting';
import MineScene from './src/page/PersonCenter'
import Category from './src/page/Category'
import CategoryDetail from './src/page/CategoryDetail'
import Latest from './src/page/Latest'
import Login from './src/page/Login'
import Login2 from './src/page/Login2'
import Register from './src/page/Register'
import UpdateModal from './src/components/UpdateModal';
import { StoreProvider } from './util/store';
import Storage from './util/storage';
import {GetSession} from './util/api'
import CodePush from "react-native-code-push";
const CODE_PUSH_PRODUCTION_KEY = 'iP5vE4FFzkilVLeIfVDZ5LwjUvdg67842615-88ee-487c-ab21-9908f18597db';
import Icon from 'react-native-vector-icons/FontAwesome';
// import IconFoundation from 'react-native-vector-icons/Foundation';

const StackNavigatorConfig = {
	headerMode: 'none',
	mode: 'card',
	cardStyle:{
		//backgroundColor:'red'
	},
	defaultNavigationOptions: {
		gesturesEnabled: false,
	},
	transitionConfig: () => ({
		screenInterpolator: StackViewStyleInterpolator.forHorizontal,
		// screenInterpolator: (sceneProps) => {
		// 	const { scene } = sceneProps;
		// 	const { route } = scene;
		// 	const params = route.params || {};
		// 	const isModal = params.isModal;
		// 	if (isModal){
		// 	  //当为`true`时，采用`modal`效果
		// 	  return StackViewStyleInterpolator.forVertical(sceneProps);
		// 	}else {
		// 	  return StackViewStyleInterpolator.forHorizontal(sceneProps);
		// 	}
		//   },
    })
}

const DrawerNavigatorConfig = {
	edgeWidth: 50,
	drawerType :'back',
	drawerWidth : $.WIDTH*.7,
	contentComponent: DrawerContent,
}

const Drawer = createDrawerNavigator({
	Index: Index,
	History: History,
	Follow: Follow,
	Theme: Theme,
	Setting: Setting,
},DrawerNavigatorConfig);

const Stack = createStackNavigator({
	Drawer: Drawer,
	Search: Search,
	MovieContent: MovieContent,
	MovieDetail: MovieDetail,
	Comment: Comment,
}, StackNavigatorConfig)

const CategoryTab = createStackNavigator({
	Category: Category,
	CategoryDetail: CategoryDetail,
	MovieDetail: MovieDetail
}, StackNavigatorConfig)

const LatestTab = createStackNavigator({
	Latest: Latest,
	MovieDetail: MovieDetail,
}, StackNavigatorConfig)

const TabNavigator = createBottomTabNavigator({
	Home: { 
		screen: Stack,  
		navigationOptions: ({ navigation }) => ({
			title: '首页',
		}) 
	},
	Latest: { 
		screen: LatestTab,
		navigationOptions: ({ navigation }) => ({
			title: '最新',
		}) 
	},
	Categories: { 
		screen: CategoryTab,
		navigationOptions: ({ navigation }) => ({
			title: '分类',
		}) 
	},
	PersonCenter: { 
		screen: MineScene,
		navigationOptions: ({ navigation }) => ({
			title: '个人中心'
		})  
	}
}, {
	defaultNavigationOptions: ({ navigation, screenProps }) => ({
	  tabBarIcon: ({ focused, tintColor }) =>
		getTabBarIcon(navigation, focused, tintColor),
		tabBarOptions: {
			activeTintColor: screenProps.themeColor[0],
			inactiveTintColor: 'gray',
		}
	})
});

const App = createAppContainer(createStackNavigator({
	Index: TabNavigator,
	Login: Login2,
	Register: Register
}, StackNavigatorConfig) )

// const App = createAppContainer(createStackNavigator({
// 	Drawer: Drawer,
// 	Search: Search,
// 	MovieContent: MovieContent,
// 	MovieDetail: MovieDetail,
// 	Comment: Comment,
// }, StackNavigatorConfig));

const getTabBarIcon = (navigation, focused, tintColor) => {
	const { routeName } = navigation.state;
	let IconComponent = Icon;
	let iconName;
	if (routeName === 'Home') {
	//   iconName = `ios-information-circle${focused ? '' : '-outline'}`;
		iconName = 'home'
	} else if (routeName === 'PersonCenter') {
		iconName = 'user'
	} else if(routeName === 'Latest') {
		iconName = 'film'
	} else if(routeName === 'Categories') {
		iconName = 'th'
	}
	return <IconComponent name={iconName} size={18}  color={tintColor}/>;
}
export default class extends PureComponent {

	state = {
		themeColor:themesGradient[0].color
	}

	setTheme = (themeColor) => {
		this.setState({themeColor});
		Storage.save('themeColor',{
			themeColor:themeColor
		});
	}

	//如果有更新的提示
    syncImmediate = async () => {
		const RemotePackage = await CodePush.checkForUpdate();
		if(RemotePackage){
			this.modal.init(RemotePackage);
		}
    }

	async componentDidMount() {
		CodePush.allowRestart();//在加载完了，允许重启
		const data = await Storage.get('themeColor');

		if(data){
			this.setState({themeColor:data.themeColor});
		}

		// 获取最新的用户信息
		NetInfo.getConnectionInfo().then((connectionInfo) => {
			if(connectionInfo.type === 'wifi' || connectionInfo.type === 'cellular ') {
				Storage.get('token').then(token =>{
					console.log('token', token)
					if(!!token) {
						global.token = token
						GetSession().then(userdata => {
							global.userInfo = userdata.user
							Storage.save('userInfo', global.userInfo);
						}).catch(err=>{
							// console.log('err', err)
							ToastAndroid && ToastAndroid.show('(；′⌒`)登陆凭证已失效', ToastAndroid.SHORT);
							global.token = ''
							Storage.delete('userInfo')
							Storage.delete('token')
						})
					}
				})
			}
		});

		setTimeout(() => {
			SplashScreen.hide();
			// this.syncImmediate(); //开始检查更新
		}, 500);
	}

	componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentWillUnmount() {
		CodePush.disallowRestart();//禁止重启
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            //BackHandler.exitApp();
            return false
        }
        this.lastBackPressed = Date.now();
        ToastAndroid && ToastAndroid.show('(；′⌒`)再按就拜拜了', ToastAndroid.SHORT);
        return true;
    }

	render(){
		const { themeColor } = this.state;
		return(
			<StoreProvider>
				<StatusBar translucent={true} backgroundColor="transparent" />
				<App screenProps={{themeColor:themeColor, setTheme:this.setTheme}} />
				<UpdateModal themeColor={themeColor} ref={ node => this.modal = node } />
			</StoreProvider>
		)
	}
}