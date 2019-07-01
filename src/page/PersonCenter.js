
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from 'react-native'

import { Heading2, Heading3, Paragraph } from '../components/Text'
import { screen, system } from '../common'
import color from '../components/Color'
import DetailCell from '../components/DetailCell'
import SpacingView from '../components/SpacingView'
import NavigationItem from '../components/NavigationItem'
import {Logout} from '../../util/api'

import Storage from '../../util/storage';
const DEVICE_WIDTH = Dimensions.get('window').width;
const BUTTON_WIDTH = DEVICE_WIDTH/4;
class MineScene extends PureComponent {

    static navigationOptions = ({navigation,screenProps}) =>{
        return ({
            title:"叫我首页",
            headerRight: <View style={{ flexDirection: 'row' }}>
                     <NavigationItem
                      icon={require('../img/mine/icon_navigation_item_set_white.png')}
                      onPress={() => {
            
                      }}
                    />
                    <NavigationItem
                      icon={require('../img/mine/icon_navigation_item_message_white.png')}
                      onPress={() => {
            
                      }}
                    />
                  </View>
        })
    }

//   static navigationOptions = ({ navigation, screenProps }) => ({
//     headerRight: (
//       <View style={{ flexDirection: 'row' }}>
//         <NavigationItem
//           icon={require('../img/mine/icon_navigation_item_set_white.png')}
//           onPress={() => {

//           }}
//         />
//         <NavigationItem
//           icon={require('../img/mine/icon_navigation_item_message_white.png')}
//           onPress={() => {

//           }}
//         />
//       </View>
//     ),
//     headerStyle: {
//       backgroundColor: color.primary,
//       elevation: 0,
//       borderBottomWidth: 0,
//     },
//   })

  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      userInfo: null,
      vip: null
    }
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    const data = await Storage.get('userInfo');
    const vip = await Storage.get('vip');
    console.log('userdata', data)
    console.log('vip', vip)
    this.setState({ 
      userInfo: data,
      vip: vip
    })
	}

  onHeaderRefresh() {
    this.setState({ isRefreshing: true })

    setTimeout(() => {
      this.setState({ isRefreshing: false })
    }, 2000)
  }

  logout() {
    const self = this
    Logout().then(()=>{
      global.token = ''
      global.userInfo = null
      Storage.delete('userInfo');
      Storage.delete('token');
      self.setState({ userInfo: null })
    })
  }

  renderCells(navigation) {
    let cells = []
    let dataList = this.getDataList()
    for (let i = 0; i < dataList.length; i++) {
      let sublist = dataList[i]
      const showCount = 0;
      for (let j = 0; j < sublist.length; j++) {
        let data = sublist[j]
        if(data.isRender){
          let cell = <DetailCell image={data.image} title={data.title} navigation={navigation} page={data.page} subtitle={data.subtitle} key={data.title} />
          cells.push(cell)
          showCount++;
        }
      }
      if(showCount >0 ){
        cells.push(<SpacingView key={i} />)
      }
    }
    console.log('cells', cells)
    return (
      <View style={{ flex: 1 }}>
        {cells}
      </View>
    )
  }

  renderHeader() {
    const { userInfo, vip} = this.state
    const {navigation} = this.props;
    return (
      <View style={[styles.header, {backgroundColor: this.props.screenProps.themeColor[0]}]}>
        {
          !!userInfo ? (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
              <Image style={styles.avatar} source={require('../img/mine/avatar.png')} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Heading2 style={{ color: 'white' }}>{userInfo.loginAccount}</Heading2>
                  { vip.isVip ? (
                    <Image style={{ marginLeft: 4 }} source={require('../img/mine/beauty_technician_v15.png')} />
                  ):null}
                </View>
                {/* <Paragraph style={{ color: 'white', marginTop: 4 }}>个人信息 ></Paragraph> */}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>

              </View>
            </View>
          ):(
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.button_register}
                activeOpacity={1}>
                  <Text style={styles.text_register}>注册</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.button_login}
                activeOpacity={1}>
                  <Text style={styles.text_login}>登陆</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }

  render() {
    const {themeColor} = this.props.screenProps
    const { userInfo} = this.state
    return (
      <View style={{ flex: 1, backgroundColor: color.paper }}>
        <View style={{ position: 'absolute', width: screen.width, height: screen.height / 4, backgroundColor: themeColor[0] }} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.onHeaderRefresh()}
              tintColor='gray'
            />
          }>
          {this.renderHeader()}
          <SpacingView />
          {this.renderCells(this.props.navigation)}
          {
            !!userInfo?(
              <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={this.logout}
                  style={[styles.button_logout, {backgroundColor:  themeColor[0]} ]}
                  activeOpacity={1}>
                  <Text style={{color: 'white'}}>退出登陆</Text>
                </TouchableOpacity>
              </View>
            ):null
          }
        </ScrollView>
      </View>
    )
  }

  getDataList() {
    // console.log('userInfouserInfouserInfouserInfo', this.state)
    const userInfo = this.state.userInfo
    const vip = this.state.vip
    const isVip = !!vip ? vip.isVip : false
    return (
      [
        [
          { title: '我的会员', subtitle: isVip ? vip.vipValidTime.substr(0, 10) + ' 到期' : '现在加入', page: 'Charge', image: require('../img/mine/icon_mine_wallet.png'), isRender: !!userInfo },
          { title: '充值历史', image: require('../img/mine/icon_mine_wallet.png'), page: 'ChargeHistory', isRender: !!userInfo },
        ],
        [
          { title: '我的收藏', image: require('../img/mine/icon_mine_collection.png'), page: 'Follow', isRender: true },
          // { title: '会员中心', subtitle: '黄金会员', image: require('../img/mine/icon_mine_membercenter.png'), isRender: !!userInfo }
        ],
        [
          { title: '设置', image: require('../img/mine/icon_mine_setting.png'), page: 'Setting', isRender: true },
          { title: '客服中心', image: require('../img/mine/icon_mine_customerService.png'), isRender: true },
          { title: '政策与条款', image: require('../img/mine/icon_mine_aboutmeituan.png'), isRender: true }
        ]
      ]
    )
  }

}


const styles = StyleSheet.create({
  icon: {
    width: 27,
    height: 27,
  },
  header: {
    // backgroundColor: color.primary,
    paddingBottom: 20,
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#51D3C6'
  },
  button_login: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth:1,
    borderColor: 'white',
    height: 40,
    width: BUTTON_WIDTH,
    borderRadius: 5,
    zIndex: 100,
  },
  button_register: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 40,
    width: BUTTON_WIDTH,
    borderRadius: 5,
    zIndex: 100,
  },
  button_logout: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: DEVICE_WIDTH/2,
    borderRadius: 20,
    zIndex: 100,
  },
  text_register: {}
  ,
  text_login: {
    color: 'white'
  }
})


export default MineScene
