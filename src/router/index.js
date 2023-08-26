import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import App from '@/App'

import login from '../views/login/login'
import changePassword from '../views/changePassword/changePassword'
import passwdChangeSuccess from '../views/passwdChangeSuccess/passwdChangeSuccess'
import taskList from '../views/taskList/taskList'
import modelTaskList from '../views/modelTaskList/modelTaskList'
import addVersion from '../views/addVersion/addVersion'
import addTask from '../views/addTask/addTask'
import addModelTask from '../views/addModelTask/addModelTask'
import inputAdd from '../views/inputAdd/inputAdd'
import outputSheetAdd from '../views/outputSheetAdd/outputSheetAdd'
import outputSheetDetail from '../views/outputSheetDetail/outputSheetDetail'
import outputColumnAdd from '../views/outputColumnAdd/outputColumnAdd'
import taskDetail from '../views/taskDetail/taskDetail'
import modelTaskDetail from '../views/modelTaskDetail/modelTaskDetail'
import taskExec from '../views/taskExec/taskExec'
import taskBackend from '../views/taskBackend/taskBackend'
import fileConfig from '../views/fileConfig/fileConfig'
import fileTableAdd from '../views/fileTableAdd/fileTableAdd'
import fileColumnAdd from '../views/fileColumnAdd/fileColumnAdd'
import history from '../views/history/history'
import changeInputSimple from '../views/changeInputSimple/changeInputSimple'
import changeOutputSimple from '../views/changeOutputSimple/changeOutputSimple'
import addDemand from '../views/addDemand/addDemand'
import demandDetail from '../views/demandDetail/demandDetail'
import outputFeed from '../views/outputFeed/outputFeed'
import demandFeed from '../views/demandFeed/demandFeed'
import showRes from '@/views/showRes/showRes'

import auditRouter from '@/router/audit'
import auditPrint from '@/router/audit/printPdf'
import complexQueryRouter from '@/router/complexQuery'
import acctRelationRouter from '@/router/complexQuery/acctRelation/graph'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const myRoutes = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('@/views/login/login')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/taskList',
    name: 'home',
    meta: {
      title: 'Requirement',
      redirect: '/taskList',
      need_log: false,
      icon: 'task'
    },
    children: [
      /**{
        path: '/password_change',
        name: 'password_change',
        hidden: true,
        component: changePassword
      },
      {
        path: '/password_done',
        name: 'password_done',
        hidden: true,
        component: passwdChangeSuccess
      }, **/
      {
        path: 'demandDetail',
        name: 'demandDetail',
        component: demandDetail,
        hidden: true,
        meta: {
          title: 'requirement detail',
          need_log: false
        }
      },
      {
        path: 'taskList',
        name: 'taskList',
        component: taskList,
        meta: {
          title: 'Requirement List',
          icon: 'task'
        }
      },
      {
        path: 'modelTaskList',
        name: 'modelTaskList',
        component: modelTaskList,
        meta: {
          title: 'Fixed Query',
          icon: 'requirement'
        }
      },
      {
        path: 'taskDetail',
        name: 'taskDetail',
        component: taskDetail,
        hidden: true,
        meta: {
          title: '任务详情',
          need_log: false
        }
      },
      {
        path: 'modelTaskDetail',
        name: 'modelTaskDetail',
        component: modelTaskDetail,
        hidden: true,
        meta: {
          title: '模块任务详情',
          need_log: false
        }
      },
      {
        path: 'addTask',
        name: 'addTask',
        component: addTask,
        hidden: true,
        meta: {
          title: '添加版本',
          need_log: false
        }
      },
      {
        path: 'addModelTask',
        name: 'addModelTask',
        component: addModelTask,
        hidden: true,
        meta: {
          title: '添加版本',
          need_log: false
        }
      },
      {
        path: 'addVersion',
        name: 'addVersion',
        component: addVersion,
        hidden: true,
        meta: {
          title: '添加版本',
          need_log: false
        }
      },
      {
        path: 'inputAdd',
        name: 'inputAdd',
        component: inputAdd,
        hidden: true,
        meta: {
          title: '添加输入参数',
          need_log: false
        }
      },
      {
        path: 'outputSheetAdd',
        name: 'outputSheetAdd',
        component: outputSheetAdd,
        hidden: true,
        meta: {
          title: '添加输出表',
          need_log: false
        }
      },
      {
        path: 'outputSheetDetail',
        name: 'outputSheetDetail',
        component: outputSheetDetail,
        hidden: true,
        meta: {
          title: '变更输出表',
          need_log: false
        }
      },
      {
        path: 'outputColumnAdd',
        name: 'outputColumnAdd',
        component: outputColumnAdd,
        hidden: true,
        meta: {
          title: '添加输出参数',
          need_log: false
        }
      },
      {
        path: 'taskExec',
        name: 'taskExec',
        component: taskExec,
        hidden: true,
        meta: {
          title: 'Query Page',
          need_log: false
        }
      },
      {
        path: 'taskBackend',
        name: 'taskBackend',
        component: taskBackend,
        hidden: true,
        meta: {
          title: '查询后台配置页面',
          need_log: false
        }
      },
      {
        path: 'fileConfig',
        name: 'fileConfig',
        component: fileConfig,
        hidden: true,
        meta: {
          title: '文件后台配置页面',
          need_log: false
        }
      },
      {
        path: 'fileTableAdd',
        name: 'fileTableAdd',
        component: fileTableAdd,
        hidden: true,
        meta: {
          title: '新增临时表页面',
          need_log: false
        }
      },
      {
        path: 'fileColumnAdd',
        name: 'fileColumnAdd',
        component: fileColumnAdd,
        hidden: true,
        meta: {
          title: '新增临时表参数页面',
          need_log: false
        }
      },
      {
        path: 'addDemand',
        name: 'addDemand',
        component: addDemand,
        hidden: true,
        meta: {
          title: 'Create Requirement',
          need_log: false,
          icon: 'requirement'
        }
      },
      {
        path: 'changeInputSimple',
        name: 'changeInputSimple',
        component: changeInputSimple,
        hidden: true,
        meta: {
          title: '编辑输入参数页面',
          need_log: false
        }
      },
      {
        path: 'changeOutputSimple',
        name: 'changeOutputSimple',
        component: changeOutputSimple,
        hidden: true,
        meta: {
          title: '编辑输出参数页面',
          need_log: false
        }
      },
      {
        path: 'outputFeed',
        name: 'outputFeed',
        component: outputFeed,
        hidden: true,
        meta: {
          title: '输出反馈',
          need_log: false
        }
      },
      {
        path: 'demandFeed',
        name: 'demandFeed',
        component: demandFeed,
        hidden: true,
        meta: {
          title: '需求反馈',
          need_log: false
        }
      }
    ]
  },
  {
    path: '/history',
    name: 'history',
    component: Layout,
    redirect: '/history',
    meta: {
      title: 'Query History',
      redirect: '/history',
      need_log: false,
      icon: 'history'
    },
    children: [
      {
        path: '',
        name: 'index',
        component: history,
        meta: { title: 'Query History', icon: 'history' }
      },
      {
        path: 'showRes',
        name: 'showRes',
        component: showRes,
        hidden: true,
        meta: {
          title: 'Result Display',
          need_log: false
        }
      }
    ]
  },
  {
    path: '/logout',
    hidden: true
  },

  // 复杂查询
  //complexQueryRouter,
  // 关联图形
  //acctRelationRouter,
  // 科创板大屏
  {
    path: '/kcb',
    redirect: '/taskList',
    component: App,
    name: 'kcb',
    meta: {
      title: 'Dashboard',
      need_log: false,
      icon: 'table'
    },
    children: [
      {
        path: 'kcbWeb',
        name: 'kcbWeb',
        hidden: false,
        component: () => import('@/views/kcbWeb/kcbWeb'),
        meta: {
          title: '综合大屏',
          need_log: false
        }
      },
      {
        path: 'kcbWebNew',
        name: 'kcbWebNew',
        hidden: true,
        component: () => import('@/views/kcbWeb/kcbWebNew'),
        meta: {
          title: '首批股票解禁综合屏',
          need_log: false
        }
      },
      {
        path: 'kcbWebNewPlus',
        name: 'kcbWebNew50',
        hidden: true,
        component: () => import('@/views/kcbWeb/kcbWebNew50'),
        meta: {
          title: '50成分股综合屏',
          need_log: false
        }
      },
      {
        path: 'kcbLine',
        name: 'kcbLine',
        hidden: false,
        component: () => import('@/views/testLineChart/testLineChart'),
        meta: {
          title: '解禁减持监控',
          need_log: false
        }
      },
      {
        path: 'kcbLineSimple',
        name: 'kcbLineSimple',
        hidden: true,
        component: () => import('@/views/testLineChart/testLineChartSimple'),
        meta: {
          title: '解禁减持监控(首日)',
          need_log: false
        }
      }
    ]
  },
  // 审计
  //auditRouter,
  // 审计打印
  //auditPrint,

  {
    path: '/404',
    component: () => import('@/views/errors/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: myRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
