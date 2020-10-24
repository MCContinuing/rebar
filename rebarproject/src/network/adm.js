import {request} from "./request";

export function getBigTask(page,status){
  return request({
    url:'getBigTask',
    params: {
      page,
      status,
    }
  })
}

export function getOldBigTask(status){
  return request({
    url:'getBigTask',
    params: {
      status,
    }
  })
}

export function getAllEmp(){
  return request({
    url:'getAllEmp',
  })
}

/**
 * 创建大任务接口
 * @param bigTask
 * @returns {AxiosPromise}
 */
export function createBigTask(bigTask) {
  return request({
    url:'createBigTask',
    method:'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: bigTask
  })
}

/**
 * 删除大任务接口
 * @param bigTaskId
 * @returns {AxiosPromise}
 */
export function deleteBigTask(bigTaskId) {
  return request({
    url:'deleteBigTask',
    params:{
      bigTaskId,
    }
  })
}

/**
 * 创建小任务接口
 * @param smallTask
 * @returns {AxiosPromise}
 */
export function createSmallTask(smallTask) {
  return request({
    url:'createSmallTask',
    method:'post',
    header:{
      'Content-Type':'application/json'
    },
    data:smallTask
  })
}


/**
 * 删除小任务
 * @param sTaskId
 * @returns {AxiosPromise}
 */
export function deleteSmallTask(sTaskId) {
  return request({
    url:'deleteSmallTask',
    params:{
      sTaskId,
    }
  })
}

/**
 * 更新小任务 只包含小任务的信息而不包含小任务的bartaskinfo信息
 * @param smallTask
 * @returns {AxiosPromise}
 */
export function updateSmallTask(smallTask) {
  return request({
    url:'updateSmallTask',
    method:'post',
    header:{
      'Content-Type':'application/json'
    },
    data:smallTask
  })
}


/**
 * 修改小任务的钢筋数量信息
 * @param sTaskId
 * @param barId
 * @param barNum
 * @returns {AxiosPromise}
 */
export function updateSmallTaskBarInfo(sTaskId,barId,barNum) {
  return request({
    url:'updateSmallTaskBarInfo',
    params:{
      sTaskId,
      barId,
      // testNum,
      // testStatus,
      barNum
    }
  })
}

/**
 * 继续添加小任务钢筋信类型
 * @param sTaskId
 * @param barId
 * @returns {AxiosPromise}
 */
export function deleteSmallTB(sTaskId,barId) {
  return request({
    url:'deleteSmallTB',
    params:{
      sTaskId,
      barId
    }
  })
}
