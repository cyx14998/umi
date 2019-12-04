import { request } from 'utils'

export function query (data) {
    return request({
        url: '/gateway/v1/epaperteacher/v1/getPublishWorkBatch',
        method: 'get',
        data
    })
}

export function start (data) {
    const { batchId, workList } = data
    return request({
        url: '/proxy/user/exam/start?batchId=' + batchId,
        method: 'post',
        data: workList
    })
}

export function end (data) {
    const { batchId } = data
    delete data.batchId
    return request({
        url: '/proxy/user/exam/end?batchId=' + batchId,
        method: 'post',
        data
    })
}

/* 
data:{examStatus: 201, workIds:[]}
*/
export function postExamStatus (data) {
    const { batchId } = data
    delete data.batchId
    return request({
        url: '/gateway/v1/epaperteacher/v1/examStatus?batchId=' + batchId,
        method: 'post',
        data
    })
}

export function getStatue (data) {
    return request({
        url: '/proxy/user/getUserStatus',
        method: 'post',
        data
    })
}