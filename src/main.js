/*
 * @Author: your name
 * @Date: 2020-06-10 16:17:42
 * @LastEditTime: 2020-07-15 18:56:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\main.js
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// eslint-disable-next-line no-unused-vars
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from '@/store'
import router from '@/router'

import '@/icons' // icon
import '@/router/permission' // permission control

import { apiRoot } from '@/api'

import '@/axios/';

import '@/assets/font/iconfont.css'

import animated from 'animate.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// export const apiRoot = process.env.VUE_APP_BASE_API

Vue.use(animated)

Vue.use(apiRoot)

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
