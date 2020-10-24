import {request} from "./request";
//请求测试
export function testSmallTask(fd){
  return  request ({
    url:'testSmallTaskImage',
    method:'post',
    timeout:200000,
    headers:{
      'Content-Type':'multipart/form-data;charset=utf-8'
    },
    data:fd
  })
}
//确认结果更新数据库数量信息
export function updateSmallTask(sTaskId){
  return request({
    url:'updateSmallTask',
    params:{
      sTaskId
    }
  })
}
//删除已存储图片信息
export function deleteImage(Id) {
    return request({
      url:'deleteImage',
      params:{
        Id,
      }
    })
}
//将图片状态改为不要
export function discordImage(Id) {
  return request({
    url:'discordImage',
    params:{
      Id,
    }
  })
}
//改变钢筋类型状态（检测未检测）
export function updateSmallTaskBarInfo(sTaskId,barId,testNum,testStatus) {
 return request({
   url:'updateSmallTaskBarInfo',
   params:{
     sTaskId,
     barId,
     testNum,
     testStatus
   }
 })
}
