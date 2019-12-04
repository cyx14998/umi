import { request } from 'utils'

export function query (data) {
    return request({
        url: '/gateway/v1/epaperteacher/v1/getPublishWorkRecords',
        method: 'get',
        data
    })
}
