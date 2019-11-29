import { request } from 'utils'
export function query (params) {
    return request({
        url: 'https://khbapi.imkehou.com/sjyk/xlj-kejians/getKjList?source=backend&session=5c2077ce840cfc708b7b81ef&page=0&isJg=-1&kcTypeId=-1&type=0&grade=-1&pageSize=16',
        method: 'get'
    })
}