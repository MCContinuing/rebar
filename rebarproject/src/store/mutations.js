import {
  ADD_ADM_TASK, ADD_ALL_BAR_INFO,
  ADD_IMG_INFO, ADD_INDEX, ADD_OLD_ADM_TASK, ADD_OLD_TASK, ADD_TEST_TASK,
  ADDPROFILE,
  ADDTAST,
  CHANGE_TASKATATE, CHANGE_TEST_NUM, DEL_ADM_BIGTASK, DEL_ADM_SMATASK, DEL_ALL_ADM_BIGTASK, DEL_ALL_BIGTASK,
  DEL_IMG_INFO, DEL_INDEX, DEL_TEST_TASK,
  DELUSER,
  LOAD_EMPS,
  LOGADMIN,
  LOGEMPLOYEE
} from "./mutations-types";
import qs from 'qs';
export default  {
  [ADDTAST](state,payload){
    //查找之前是否有一样的任务
    let haventask = state.newList.find(item => item.id === payload.id);
    let index = state.newList.findIndex(item => item.id === payload.id)
    // console.log('比较了')
    // console.log(index)
    // console.log(haventask)
    // console.log(payload)
    //如果没有则加入新任务
    if(!haventask) {
      state.newList.push(payload)
      console.log('添加了一个大任务')
      // console.log(state.newList)
    }
    //如果有,再次查找是否有一样的小任务
    else{
      console.log('此大任务已经存在，不再重复添加');
      let index = state.newList.findIndex(item => item.id === payload.id)
      let haventasklist = haventask.taskIDList.find(item=>item.iid === payload.taskIDList[0].iid)
      // console.log(index)
      // console.log(haventasklist)
      // console.log(payload.taskIDList)
      //如果没有则加入新任务
      if(!haventasklist){
        state.newList[index].taskIDList.push(payload.taskIDList[0])
        console.log('添加了一个小任务')
        // console.log(state.newList)
      }else{
        console.log('此小任务已经存在，不再重复添加');
      }
    }
  },
  [ADD_OLD_TASK](state,payload){
    //查找之前是否有一样的任务
    let haventask = state.oldList.find(item => item.id === payload.id);
    let index = state.oldList.findIndex(item => item.id === payload.id)
    // console.log('比较了')
    // console.log(index)
    // console.log(haventask)
    // console.log(payload)
    //如果没有则加入新任务
    if(!haventask) {
      state.oldList.push(payload)
      console.log('添加了一个大任务')
      // console.log(state.newList)
    }
    //如果有,再次查找是否有一样的小任务
    else{
      console.log('此大任务已经存在，不再重复添加');
      let index = state.oldList.findIndex(item => item.id === payload.id)
      let haventasklist = haventask.taskIDList.find(item=>item.iid === payload.taskIDList[0].iid)
      // console.log(index)
      // console.log(haventasklist)
      // console.log(payload.taskIDList)
      //如果没有则加入新任务
      if(!haventasklist){
        state.oldList[index].taskIDList.push(payload.taskIDList[0])
        console.log('添加了一个小任务')
        // console.log(state.newList)
      }else{
        console.log('此小任务已经存在，不再重复添加');
      }
    }
  },
  //登陆管理员修改状态为1
  [LOGADMIN](state){
    state.loginState = 1;
  },
  //登陆员工修改状态为0
  [LOGEMPLOYEE](state){
    state.loginState = 0;
  },
  //登陆后将用户信息存储到profile
  [ADDPROFILE](state,profile){
    state.profile=profile;
    localStorage.setItem("test",'niu');
    console.log(localStorage.getItem("isLogin"));
  },
  isLog(state,profile){
    localStorage.setItem("isLogin",qs.stringify(profile));
    localStorage.setItem("test",'niu');
    console.log(localStorage.getItem("isLogin"));
  },
  //退出登陆后清除所有数据
  [DELUSER](state){
    state.profile = {}
    state.newList = []
    state.oldList = []
    state.newAdmList = []
    state.oldAdmList =[]
    state.emps = {}
    state.loginState = null
  },
  //检测完毕改变任务状态
  [CHANGE_TASKATATE](state,ids){

    let index1 = state.newList.findIndex(item => item.id === parseInt(ids.id))
    // console.log(index1);
    let index2 = state.newList[index1].taskIDList.findIndex(item => item.iid === parseInt(ids.iid))
    // console.log(index2);
    state.newList[index1].taskIDList[index2].state = '已检测'

    //将此小任务添加到历史任务中
    let task = {
      id:ids.id,
      taskID:state.newList[index1].taskID,
      taskIDList:[state.newList[index1].taskIDList[index2]]
    };
    // console.log(task);
    //查找之前是否有一样的任务
    let haventask = state.oldList.find(item => item.id === ids.id)
    let index = state.oldList.findIndex(item => item.id === ids.id)
    //如果没有则加入新任务
    if(!haventask) {
      state.oldList.unshift(task)
      console.log('添加了一个历史大任务')
      // console.log(state.oldList);
    }
    //如果有,再次查找是否有一样的小任务
    else{
      console.log('此历史大任务已经存在，不再重复添加');
      let index = state.oldList.findIndex(item => item.id === ids.id)
      let haventasklist = haventask.taskIDList.find(item=>item.iid === ids.iid)
      //如果没有则加入新任务
      if(!haventasklist){
        state.oldList[index].taskIDList.push(task.taskIDList[0])
        console.log('添加了一个历史小任务')
      }else{
        console.log('此历史小任务已经存在，不再重复添加');
      }
    }
    //将此小任务从新任务中删除
    state.newList[index1].taskIDList.splice(index2,1)
    console.log('hasdelete 1');
    // console.log(state.newList)
    //判断小任务删除后大任务下是否为空
    if(state.newList[index1].taskIDList.length===0){
      //为空则删除大任务
      // state.newList.splice(index1,1)
      state.newList.splice(index1,1)
      console.log('hasdelete 2');
    }
  },
  //增加管理员的新任务
  [ADD_ADM_TASK](state,payload){
    //查找之前是否有一样的任务
    let haventask = state.newAdmList.find(item => item.id === payload.id)
    let index = state.newAdmList.findIndex(item => item.id === payload.id)
    // console.log('比较了')
    // console.log(index)
    // console.log(haventask)
    // console.log(payload)
    //如果没有则加入新任务
    if(!haventask) {
      state.newAdmList.push(payload)
      console.log('添加了一个大任务')
      // console.log(state.newAdmList)
    }
    //如果有,再次查找是否有一样的小任务
    else{
      console.log('此大任务已经存在，不再重复添加');
      let index = state.newAdmList.findIndex(item => item.id === payload.id)
      let haventasklist = haventask.taskIDList.find(item=>item.iid === payload.taskIDList[0].iid)
      // console.log(index)
      // console.log(haventasklist)
      // console.log(payload.taskIDList)
      //如果没有则加入新任务
      if(!haventasklist){
        state.newAdmList[index].taskIDList.push(payload.taskIDList[0])
        console.log('添加了一个小任务')
        // console.log(state.newAdmList)
      }else{
        console.log('此小任务已经存在，不再重复添加');
      }
    }
  },
  //增加管理员的历史任务
  [ADD_OLD_ADM_TASK](state,payload){
    //查找之前是否有一样的任务
    let haventask = state.oldAdmList.find(item => item.id === payload.id)
    let index = state.oldAdmList.findIndex(item => item.id === payload.id)
    // console.log('比较了')
    // console.log(index)
    // console.log(haventask)
    // console.log(payload)
    //如果没有则加入新任务
    if(!haventask) {
      state.oldAdmList.push(payload)
      console.log('添加了一个大任务')
      // console.log(state.newAdmList)
    }
    //如果有,再次查找是否有一样的小任务
    else{
      console.log('此大任务已经存在，不再重复添加');
      let index = state.oldAdmList.findIndex(item => item.id === payload.id)
      let haventasklist = haventask.taskIDList.find(item=>item.iid === payload.taskIDList[0].iid)
      // console.log(index)
      // console.log(haventasklist)
      // console.log(payload.taskIDList)
      //如果没有则加入新任务
      if(!haventasklist){
        state.oldAdmList[index].taskIDList.push(payload.taskIDList[0])
        console.log('添加了一个小任务')
        // console.log(state.newAdmList)
      }else{
        console.log('此小任务已经存在，不再重复添加');
      }
    }
  },
  //删除管理员小任务(根据taskID 与taskIID)
  [DEL_ADM_SMATASK](state,taskIds){
    let hasBigTask = state.newAdmList.find(item => item.taskID === taskIds.taskID);
    let index1 = state.newAdmList.findIndex(item => item.taskID === taskIds.taskID)
    //如果有大任务则查找小任务
    if(hasBigTask){
      let hasSmallTask = hasBigTask.taskIDList.find(item => item.taskIID === taskIds.taskIID);
      let index2 = hasBigTask.taskIDList.findIndex(item => item.taskIID === taskIds.taskIID);
      //如果有小任务则删除
      if(hasSmallTask){
        state.newAdmList[index1].taskIDList.splice(index2,1);
        console.log('删除小任务');
      }
    }
  },
  //删除管理员大任务(根据taskID)
  [DEL_ADM_BIGTASK](state,taskID){
    console.log('来了');
    let hasBigTask = state.newAdmList.find(item => item.taskID === taskID);
    let index1 = state.newAdmList.findIndex(item => item.taskID === taskID)
    if(hasBigTask){
      state.newAdmList.splice(index1,1);
      console.log('删除大任务');
    }
  },

  //添加所有员工姓名和序号
  [LOAD_EMPS](state,empsAll){
    state.emps = empsAll
  },
  //添加所有钢筋类型和id
  [ADD_ALL_BAR_INFO](state,allBarInfo){
    state.allBarInfo = allBarInfo
  },

  //添加图片详情信息
  [ADD_IMG_INFO](state,resImageInfo){
    state.resImageInfo = resImageInfo
  },
  //删除图片信息
  [DEL_IMG_INFO](state){
    state.resImageInfo = []
  },
  //添加索引
  [ADD_INDEX](state,indexStu){
    state.indexStu = indexStu;
  },
  //删除索引
  [DEL_INDEX](state){
    state.indexStu = null;
  },
  //添加随机任务
  [ADD_TEST_TASK](state,testTask){
    state.testTask = testTask;
  },
  //清空列表
  [DEL_TEST_TASK](state){
    state.testTask = {};
  },
  //改变测试数量
  [CHANGE_TEST_NUM](state,ids){
    let index1 = state.newList.findIndex(item => item.id === ids.id);
    let index2 = state.newList[index1].taskIDList.findIndex(item=>item.iid === ids.iid);
    let index3 = state.newList[index1].taskIDList[index2].kindall.findIndex(item=>item.barId === ids.barId);
    state.newList[index1].taskIDList[index2].kindall[index3].testnum = ids.testName;
  },
  //删除所有store中钢筋信息，刷新使用
  [DEL_ALL_ADM_BIGTASK](state){
    state.newAdmList.splice(0,state.newAdmList.length);
    console.log('删除所有了');
    console.log('state.newAdmList');
    console.log(state.newAdmList);
  }

}
