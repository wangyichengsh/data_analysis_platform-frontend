import request from '@/utils/request'

// const taskApiHost = process.env.VUE_APP_BASE_API + 'task/'

// export const queryRequirement = params => { return axios.get(`${taskApiHost}req/`, params) }

export function queryRequirement(params) {
  return request({
    url: 'task/req/',
    method: 'get',
    params: {}
  })
}
