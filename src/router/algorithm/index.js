import Layout from '@/layout/index'

const algorithmRouter = {
  path: '/algorithm',
  component: Layout,
  meta: {
    title: '算法管理',
    icon: 'algorithm'
  },
  children: [
    {
      path: 'investor',
      name: 'Investor',
      component: () => import('@/views/algorithm/investor'),
      meta: { title: '投资者画像', icon: 'investor' }
    },
    {
      path: 'alert',
      name: 'Alert',
      component: () => import('@/views/algorithm/alert'),
      meta: { title: '预警指标', icon: 'alert' }
    }
  ]
}

export default algorithmRouter
