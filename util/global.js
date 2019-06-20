import {
    StatusBar,
    PixelRatio,
    AsyncStorage,
    Platform,
    Dimensions
  } from 'react-native';
  
  if (!__DEV__) {
    global.console = {
      info: () => {},
      log: () => {},
      warn: () => {},
      debug: () => {},
      error: () => {}
    };
  }
  
  const { width, height} = Dimensions.get('window');
  const STATUS_HEIGHT = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);
  const COVER_URL = 'http://192.168.45.129:8081/';
  const VIDEO_URL = 'http://192.168.45.129:8888';

  // const COVER_URL = 'http://27.124.2.112:90/images/';
  // const VIDEO_URL = 'http://27.124.2.112:8888';

  global.__IOS__ = Platform.OS==='ios';
  
  global.$ = {
    STATUS_HEIGHT: STATUS_HEIGHT,
    WIDTH: width,
    HEIGHT: height,
    PixelRatio: PixelRatio.get(),
    COVER_URL: COVER_URL,
    VIDEO_URL: VIDEO_URL
  }

  