/*
 * @Author: 张杰
 * @Date: 2020-07-15 18:35:59
 * @LastEditTime: 2020-07-15 18:44:03
 * @LastEditors: 张杰
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\axios\index.js
 */
import axios from 'axios';
import { saveAuthedInfos } from '@/utils/storageUtil'
// import storage from '../static/js/storage';
import { getLocalStore } from '@/utils/storageUtil'
import { Message } from "element-ui";
import router from '@/router'

axios.defaults.timeout = 50000;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    var token = getLocalStore('token');
    var ngsp_token = getLocalStore('ngsp_token');
    var if_ngsp = config.url.indexOf('ngsp') > 0;
    // 判断使用哪个token
    if (token && !if_ngsp) {
      config.headers.Authorization = `Token  ${token}`;;
    }
    if (ngsp_token && if_ngsp) {
      config.headers.Authorization = ngsp_token;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  resp => {
    // 判断token是否有效（条件待修改）
    const status = resp.status;
    if (status === 401) {
      router.push({
        path: '/login',
        query: { redirect: router.currentRout.fullpath }
      })
    }
    return resp;
  }, error => {
    Message({
      message: error.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default axios
