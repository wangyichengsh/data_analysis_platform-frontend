import request from '@/utils/request'

// export function queryTaskData(tab, userid, listQuery) {
//   return request({
//     url: '/task/requirement/',
//     method: 'get',
//     params: {
//       tab: tab,
//       userid: userid,
//       listQuery: listQuery
//     }
//   })
// }

export function queryTaskData(page_size, page, ordering, create_by, search_fields) {
  return request({
    url: '/tasks/requirement/',
    method: 'get',
    params: {
      page_size: page_size,
      page: page,
      ordering: ordering,
      create_by: create_by,
      search_fields: search_fields
    }
  })
}
