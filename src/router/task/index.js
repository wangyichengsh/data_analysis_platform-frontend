import Layout from '@/layout'

const taskRouter = {
  path: '/task',
  name: 'Task',
  component: Layout,
  meta: { title: '任务管理', icon: 'task' },
  redirect: '/task/requirement/index',
  children: [
    {
      path: 'requirement',
      // component: Layout,
      component: () => import('@/views/task/requirement/index'),
      name: 'Requirement',
      redirect: '/task/requirement/list',
      meta: { title: '需求任务', icon: 'requirement' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/task/requirement/list/index'),
          name: 'RequirementList',
          meta: { title: '需求任务', icon: 'requirement' }
          // hidden: true,
        },
        {
          path: 'create',
          name: 'CreateRequirement',
          meta: { title: '创建需求', icon: 'develop' },
          // hidden: true,
          component: () => import('@/views/task/requirement/create/index')
        },
        {
          path: 'update',
          name: 'UpdateRequirement',
          meta: { title: '更新需求', icon: 'develop' },
          // hidden: true,
          component: () => import('@/views/task/requirement/create/index')
        }
      ]
    },
    {
      path: 'devtask',
      component: () => import('@/views/task/devtask'),
      name: 'devtask',
      meta: { title: '开发任务', icon: 'develop' }
    }
  ]
}

export default taskRouter
