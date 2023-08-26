import Layout from '@/layout/index'

const auditRouter = {
  path: '/audit',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'AuditIndex',
      component: () => import('@/views/audit/index'),
      meta: { title: '审计', icon: 'audit' }
    }
  ]
}
export default auditRouter
