/*
 * @Author: your name
 * @Date: 2020-06-29 09:13:39
 * @LastEditTime: 2020-07-22 15:23:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\api\component\index.js
 */
import axios from 'axios'

const ApiHost = process.env.VUE_APP_BASE_API + 'component'

// 非交易日
export const getShHoliday = params => { return axios.get(`${ApiHost}/dateCalendar/`, { 'is_week_end': 0, 'is_mkt_sh': 0 }) }

// 执行指定的应用
export const executeApp = (app_id, parameter, remark) => { return axios.post(`${ApiHost}/appExecuteHistory/`, { app_id: app_id, parameter: parameter, remark: remark }) }

// 获取历史记录
export const getHistory = (app_id, page_size, page, order_by, history_id) => {
  return axios.get(`${ApiHost}/appExecuteHistory/`, { params: { app_id: app_id, page_size: page_size, page: page, ordering: order_by, history_id: history_id } })
}

// 修改备注
export const patchHistoryRemark = (id, remark) => { return axios.patch(`${ApiHost}/appExecuteHistory/${id}/`, { remark: remark }) }

// 标志已查看过
export const putHasViewedTrue = (id, hasViewed) => { return axios.post(`${ApiHost}/appExecuteHistory/${id}/`, { hasViewed: true }) }
