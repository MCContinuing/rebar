import {request} from "./request";
import qs from 'qs'
//对所有任务模块中的网络请求统一管理
//检测模块中上传图片并请求结果

//请求任务
export function getSmallTasks(page,status) {
  return request({
    url: 'getSmallTasks',
    //请求带上cookie
    // withCredentials:true,
    // crossDomain:true,
    // responseType:'json',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    params: {
      page,
      status,
    }
  })
}

// 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
// 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function test() {
//   const names = ['why', 'aaa']
// }
//
// test()
//
// test()
let totalNums = []

const nums1 = [20, 11, 222]
const nums2 = [111, 22, 333]
// for (let n of nums1) {
//   totalNums.push(n)
// }
// totalNums.push(...nums1)
