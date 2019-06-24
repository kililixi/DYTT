
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'

import { Heading2, Heading3, Paragraph } from '../components/Text'
import { screen, system } from '../common'
import color from '../components/Color'
import DetailCell from '../components/DetailCell'
import SpacingView from '../components/SpacingView'
import NavigationItem from '../components/NavigationItem'

class MineScene extends PureComponent {

    static navigationOptions = ({navigation,screenProps}) =>{
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
      isRefreshing: false
    }
  }

  onHeaderRefresh() {
    this.setState({ isRefreshing: true })

    setTimeout(() => {
      this.setState({ isRefreshing: false })
    }, 2000)
  }

  renderCells(navigation) {
    let cells = []
    let dataList = this.getDataList()
    for (let i = 0; i < dataList.length; i++) {
      let sublist = dataList[i]
      for (let j = 0; j < sublist.length; j++) {
        let data = sublist[j]
        let cell = <DetailCell image={data.image} title={data.title} navigation={navigation} page={data.page} subtitle={data.subtitle} key={data.title} />
        cells.push(cell)
      }
      cells.push(<SpacingView key={i} />)
    }

    return (
      <View style={{ flex: 1 }}>
        {cells}
      </View>
    )
  }

  renderHeader() {
    return (
      <View style={[styles.header, {backgroundColor: this.props.screenProps.themeColor[0]}]}>
        <Image style={styles.avatar} source={require('../img/mine/avatar.png')} />
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Heading2 style={{ color: 'white' }}>用户</Heading2>
            <Image style={{ marginLeft: 4 }} source={require('../img/mine/beauty_technician_v15.png')} />
          </View>
          {/* <Paragraph style={{ color: 'white', marginTop: 4 }}>个人信息 ></Paragraph> */}
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: color.paper }}>
        <View style={{ position: 'absolute', width: screen.width, height: screen.height / 2, backgroundColor: this.props.screenProps.themeColor[0] }} />
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
        </ScrollView>
      </View>
    )
  }

  getDataList() {
    return (
      [
        [
          { title: '我的钱包', subtitle: '充值好礼', image: require('../img/mine/icon_mine_wallet.png') },
          { title: '余额', subtitle: '￥95872385', image: require('../img/mine/icon_mine_balance.png') },
        ],
        [
          { title: '我的收藏', image: require('../img/mine/icon_mine_collection.png'), page: 'Follow' },
          { title: '会员中心', subtitle: '黄金会员', image: require('../img/mine/icon_mine_membercenter.png') }
        ],
        [
          { title: '设置', image: require('../img/mine/icon_mine_setting.png'), page: 'Setting' },
          { title: '客服中心', image: require('../img/mine/icon_mine_customerService.png') },
          { title: '政策与条款', image: require('../img/mine/icon_mine_aboutmeituan.png') }
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
  }
})


export default MineScene
