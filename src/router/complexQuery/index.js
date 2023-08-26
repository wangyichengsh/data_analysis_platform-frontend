/*
 * @Author: 张杰
 * @Date: 2020-06-29 09:13:39
 * @LastEditTime: 2020-07-07 16:58:26
 * @LastEditors: 张杰
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\router\complexQuery\index.js
 */
import Layout from '@/layout/index'
import acctRelationRouter from './acctRelation'


const complexQueryRouter = {
  path: '/complexQuery',
  component: Layout,
  meta: { title: '复杂查询', icon: 'table-complex' },
  hidden: false,
  children: acctRelationRouter
}
export default complexQueryRouter
