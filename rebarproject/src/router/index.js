import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/emplogin',
    name: '',
    component: () => import('../views/employee/EmpLogin'),
    children: [
      {  path: '/',
        redirect: '/task'},
      {
        path: '/statistic',
        name: 'Statistic',
        component: () => import('../views/employee/statistic/Statistic')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/employee/profile/Profile')
      },
      {
        path: '/detection',
        name: 'Detection',
        component: () => import('../views/employee/detection/Detection')
      },
      {
        path: '/task',
        name: 'Task',
        component: () => import('../views/employee/task/Task')
      },
      {
        path: '/detail/:id/:iid',
        name: 'Detail',
        component: () => import('../views/employee/detail/Detail')
      },
      {
        path: '/gotask/:id/:iid',
        name: 'GoTask',
        component: () => import('../views/employee/gotask/GoTask')
      },
      {
        path: '/imgDetail/:id/:iid/:barindex',
        name: 'ImgDetail',
        component: () => import('../views/employee/imgDetail/ImgDetail')
      },
    ]
  },
  {
    path: '/admlogin',
    name: '',
    component: () => import('../views/administrator/AdmLogin'),
    children:[
      {  path: '/',
        redirect: '/admTask'},
      {
        path: '/admStatistic',
        name: 'AdmStatistic',
        component: () => import('../views/administrator/admStatistic/AdmStatistic')
      },
      {
        path: '/admProfile',
        name: 'AdmProfile',
        component: () => import('../views/administrator/admProfile/AdmProfile')
      },
      {
        path: '/admTask',
        name: 'AdmTask',
        component: () => import('../views/administrator/admTask/AdmTask')
      },
      {
        path:'/admAddTask',
        name:'AdmAddTask',
        component:() => import('../views/administrator/admAddTask/AdmAddTask')
      },
      {
        path:'/admAddSmallTask',
        name:'AdmAddSmallTask',
        component:() => import('../views/administrator/admAddTask/AdmAddSmallTask')
      },
      {
        path: '/admEditTask/:id/:iid',
        name: 'AdmEditTask',
        component: () => import('../views/administrator/admEditTask/AdmEditTask')
      },
      {
        path: '/admShowTask/:id/:iid',
        name: 'AdmShowTask',
        component: () => import('../views/administrator/admShowTask/AdmShowTask')
      },
    ]
  },

]

const router = new VueRouter({
  // mode: 'history',
  //TODO tomcat中加此属性
  base:'rebarproject',
  routes
})

export default router
