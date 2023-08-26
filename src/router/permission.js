import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getLocalStore, clearLocalStore } from '@/utils/storageUtil'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar 页面加载进度条
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 获取用户登录状态
  const token = getLocalStore('token')

  // 登出后清空localStorage并进入登录页面
  if (to.path === '/logout') {
    // 清空
    clearLocalStore();
    // 跳转到登录
    next({ path: '/login' })
    NProgress.done()
    // eslint-disable-next-line brace-style
  }
  // 进入登录页面时若已登录，则进入首页
  else if (to.path === '/login') {
    if (token) {
      // 跳转到首页
      next({ path: '/taskList' })
      NProgress.done()
    }
    // eslint-disable-next-line brace-style
  }
  // 进入其他页面时，若未登录则进入登录页面，登陆后跳转至该页面
  else {
    if (token === null) {
      clearLocalStore();
      // next({path:'/login',query: {redirect: to.fullPath}});
      let redir = to.query;
      redir['redirect'] = to.path;
      next({path:'/login',query:redir})
      // next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
  next()

  // if (hasToken) {
  //   console.log('path = ' + to.path)
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')
  //
  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         // await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         // NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
