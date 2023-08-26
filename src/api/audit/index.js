/*
 * @Author: 张杰
 * @Date: 2020-07-15 18:35:59
 * @LastEditTime: 2020-07-15 18:43:38
 * @LastEditors: 张杰
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\api\audit\index.js
 */
import request from '@/utils/request'
import axios from 'axios'

let host = process.env.VUE_APP_HOST;
// const taskApiHost = process.env.VUE_APP_BASE_API + 'task/'

// export const queryRequirement = params => { return axios.get(`${taskApiHost}req/`, params) }

// export function queryAuditMonths(params) {
//   return axios.get(`${host}/api/audit/month/`, { params: {}})
//
// }

export const queryAuditPermisson = params => {
  return axios.get(`${host}/api/audit/data/`, { params: { action: 'permission' } })
};

export const queryAuditMonths = params => { return axios.get(`${host}/api/audit/month/`, { params: {} }) };

export const queryAuditData = (start_month, end_month, is_group) => { return axios.get(`${host}/api/audit/data/`, { params: { start_month: start_month, end_month: end_month, is_group: is_group, action: 'list' } }) };

export const updateAuditData = (data) => { return axios.patch(`${host}/api/audit/data/`, data) }

export const exportAuditReport = (start_month, end_month) => { return axios.get(`${host}/api/audit/data/`, { params: { start_month: start_month, end_month: end_month, action: 'report' }, responseType: 'blob' }) };

export function exportAuditDetail (start_month, end_month, is_group) {
  // axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
  return axios({
    method: 'get',
    url: `${host}/api/audit/data/`,
    params: { start_month: start_month, end_month: end_month, is_group: is_group, action: 'export' },
    responseType: 'blob'
  })
}
