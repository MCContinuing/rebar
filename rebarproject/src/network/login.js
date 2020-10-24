import {request} from "./request";
import qs from 'qs';

export function getlogin(username,password,lever) {
  return request({
    method: 'post',
    url: 'login',
    headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
    data: qs.stringify({
      username,
      password,
      lever
    })
  })
}

export function getAllBarInfo(){
  return request({
    url:'getAllBarInfo',
  })
}

