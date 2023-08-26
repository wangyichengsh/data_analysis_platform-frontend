import axios from 'axios'

const authApiHost = process.env.VUE_APP_BASE_API + 'auth/'
// const authApiHost = apiRoot + 'auth/'

// 用户密码登录接口
export const Login = params => { return axios.post(`${authApiHost}login/`, params) }
// ngsp_token登录接口
export const NgspLogin = ngsp_token => { return axios.get(`${authApiHost}ngsp_login/`, { params: { ngsp_token: ngsp_token }}) }

