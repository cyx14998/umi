import { request } from 'utils'

export function login (data) {
  return request({
    url: '/gateway/oauth/v2/token',
    method: 'get',
    data
  })
}

export function getMyInfo (data) {
  return request({
    url: '/gateway/v4/relation/class/get_my_classes',
    method: 'get',
    data
  })
}

