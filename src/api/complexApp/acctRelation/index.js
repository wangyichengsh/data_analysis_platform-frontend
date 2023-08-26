/*
 * @Author: 张杰
 * @Date: 2020-06-29 09:13:39
 * @LastEditTime: 2020-07-15 20:18:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\api\complexApp\acctRelation\index.js
 */
import axios from 'axios'

const ApiHost = process.env.VUE_APP_BASE_API + 'complexApp/acctRelation'

export const queryInvalidDevice = params => { return axios.get(`${ApiHost}/invalidDevice/`, { params: {} }) }

export function queryAcctRelation (id, tab, filters, page_size, page_number, order_by) {
  return axios.get(`${ApiHost}/table/`, { params: { id: id, tab: tab, filters: filters, page_size: page_size, page_number: page_number, order_by: order_by } })
}

export const queryAcctGraph = (appId, id, queryId, graphGroup, useAcctDefaultGroup) => {
  return axios.get(`${ApiHost}/graph/`, { params: { app_id: appId, id: id, query_id: queryId, graph_group: graphGroup, use_acct_default_group: useAcctDefaultGroup } })
}

export const queryPath = (appId, id, queryId, graphGroup, nodeA, nodeB) => {
  return axios.post(`${ApiHost}/graph/`, { app_id: appId, id: id, query_id: queryId, graph_group: graphGroup, nodeA: nodeA, nodeB: nodeB })
}

export function exportAcctRelationFile (id, app_id, file_type) {
  // axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
  return axios({
    method: 'get',
    url: `${ApiHost}/downloadFile/`,
    params: { id: id, app_id: app_id, file_type: file_type },
    responseType: 'blob'
  })
}

export function exportAcctRelationDoc () {
  // axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
  return axios({
    method: 'get',
    url: `${ApiHost}/document/`,
    responseType: 'blob'
  })
}