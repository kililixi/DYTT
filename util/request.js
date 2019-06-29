import axios from 'axios';
import {ToastAndroid} from 'react-native';

const instance = axios.create({
    baseURL: $.LOCAL + '',
    timeout: 1000 * 30 
});

//请求拦截处理
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('token', global.token)
    if (global.token) {
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['X-Token'] = global.token
      }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//返回拦截处理
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    // console.log('err', JSON.parse(JSON.stringify(error))) 
    console.log('err', error.response)
    ToastAndroid && ToastAndroid.show(error.response.status === 404 ? '404 not found' : error.response.data.message, ToastAndroid.LONG);
    return Promise.reject(error.response.data)
});

export default instance