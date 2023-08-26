/*
 * @Author: your name
 * @Date: 2020-06-29 09:13:39
 * @LastEditTime: 2020-07-24 08:29:38
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\router\complexQuery\acctRelation\index.js
 */
const acctRelationRouter = [{
  path: 'acctRelation',
  name: 'AcctRelation',
  component: () => import('@/views/complexQuery/acctRelation/index'),
  meta: { title: '物理关联（试运行）', icon: 'relation' }
}]

export default acctRelationRouter


