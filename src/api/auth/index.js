import request from '@/utils/request'

// 用户密码登录
export function login(data) {
  return request({
    url: '/auth/login/',
    method: 'post',
    data
  })
}

// 新监察系统登陆
export function ngspLogin(data) {
  return request({
    url: '/auth/ngsp_login/',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/auth/userinfo/',
    method: 'get',
    params: { token }
  })
}

// 登出（暂不使用）
export function logout() {
  return request({
    url: '/auth/logout/',
    method: 'post'
  })
}
