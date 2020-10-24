import {request} from "./request";
import qs from 'qs'
//对所有检测模块中的网络请求统一管理
//检测模块中上传图片并请求结果

//创建随机检测任务
export function createNewTestTask(testTask){
  return request({
    method:'post',
    url:'createNewTestTask',
    headers: {
      'Content-Type': 'application/json'
    },
    data: testTask,

  })
}

//获取随机任务
export function getTestTaskByEmp(status){
  return request({
    method:'post',
    url:'getTestTaskByEmp',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data:qs.stringify({
      status,
    })
  })
}

//随机检测
