// 需求优先级
export const taskPriority = [
  { key: 1, value: '特级' },
  { key: 2, value: '一般' }
]
// export const taskPriorityDisplay = taskPriority.reduce((acc, cur) => {
//   acc[cur.key] = cur.value
//   return acc
// }, {})

// export function DisplayKeyValue(dict) {
//   return {
//     dict.reduce((dict, acc, cur) => {
//       acc[cur.key] = cur.value
//       return acc
//     }, {})
//   }
// }

// 需求任务状态
export const taskStatus = [
  { key: 'examining', value: '审核中' },
  { key: 'wait', value: '评估中' },
  { key: 'conforming', value: '确认中' },
  { key: 'conformed', value: '已确认' },
  { key: 'developing', value: '开发中' },
  { key: 'accepting', value: '验收中' },
  { key: 'finished', value: '已完成' },
  { key: 'cancel', value: '已取消' }
]
// export const taskStatusDisplay = taskStatus.reduce((acc, cur) => {
//   acc[cur.key] = cur.value
//   return acc
// }, {})
// 需求结果类型
export const taskReusltTypes = [
  { key: 'file', value: '输出结果文件' },
  { key: 'module', value: '输出查询功能' }
]
// export const taskReusltTypesDisplay = taskReusltTypes.reduce((acc, cur) => {
//   acc[cur.key] = cur.value
//   return acc
// }, {})
// 文件类型
export const fileType = [
  { key: 'req_file', value: '需求附件' },
  { key: 'req_reason_file', value: '需求依据附件' },
  { key: 'bug_file', value: '问题反馈附件' },
  { key: 'res_file', value: '结果附件' }
]
// export const fileTypeDisplay = fileType.reduce((acc, cur) => {
//   acc[cur.key] = cur.value
//   return acc
// }, {})
