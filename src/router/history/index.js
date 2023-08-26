import Layout from '@/layout/index'

const historyRouter = {
  path: '/history',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('@/views/history/index'),
      meta: { title: '历史记录', icon: 'history' }
    }
  ]
}

export default historyRouter
