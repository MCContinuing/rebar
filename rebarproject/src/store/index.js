import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations";

//安装插件
Vue.use(Vuex)
//创建store对象

const state = {
    //检测图片时判断页面是否是跳转过来的
    skip:false,
    //对象中有两个对象new与old,每个对象是一个数组放入一个个任务对象
    //记录登陆状态 lever 1是管理员,0是员工
    loginState:null,
    //个人档案
    profile:null,

    //所有员工
    emps:{},
    //所有钢筋类型
    allBarInfo:[],
    newList: [],
    oldList: [],
    //随机检测任务
    testTask:{

    },
    //存储一次检测的图片信息
    resImageInfo:[],
    //存储索引信息
    indexStu:null,

    newAdmList:[],
    oldAdmList:[],
  }

export default new Vuex.Store({
  state: state,
  mutations,
  actions: {
  },
  modules: {
  }
})

//将任务添加到任务列表中
//数组常用方法push/pop/unshift/shift/sort/reverse/map/filter/reduce
//this.$store.tasksList['old'].push(produce)
//改用mutations方法
//this.$store.commit('addTask',produce)
