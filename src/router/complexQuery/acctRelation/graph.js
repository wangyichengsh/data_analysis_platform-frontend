/*
 * @Author: 张杰
 * @Date: 2020-07-08 17:10:37
 * @LastEditTime: 2020-07-24 08:31:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\router\complexQuery\acctRelation\graph.js
 */

const acctRelationGraph = {
  name: 'AcctRelationGraph',
  path: '/complexQuery/acctRelation/graph',
  component: () => import('@/views/complexQuery/acctRelation/graph'),
  meta: { title: '物理关联图形（试运行）' },
  hidden: true
}

export default acctRelationGraph