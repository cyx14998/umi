import * as routerRedux from "react-router-redux";
import { message } from 'antd'
import { query } from './service'

export default {
    namespace: 'list',

    state: {
        listData: [],
        workType: 0,
        workStatus: 1,
        page: 1,
        pageSize: 20,
        end: true
    },
    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/list') {
                    dispatch({ type: 'clearStatus'})
                    const accessToken = sessionStorage.getItem('accessToken')
                    if (accessToken) {
                        dispatch({ type: 'query', payload: { page: 1 } })
                    }
                }
            });
        },
    },

    effects: {
        * query ({ payload, }, { put, call, select }) {
            const { listData, page, workType, workStatus, pageSize } = yield select(_ => _.list)
            let params = {
                page,
                workType,
                workStatus,
                pageSize
            }
            if (payload && payload.page) {
                params.page = payload.page
            }
            const res = yield call(query, params)
            if (res && res.success && res.data && res.data.pageList) {
                let data = handData(res)
                data = listData.concat(data)
                yield put({
                    type: 'dealData',
                    payload: {
                        listData: data || [],
                        accessToken: params.accessToken,
                        page: Number(params.page) + 1,
                        end: false
                    },
                })
                if (res.data.pageList.length < params.pageSize) {
                    yield put({
                        type: 'dealData',
                        payload: {
                            end: true
                        },
                    })
                }
                if (res.data.pageList.length === 0) {
                    message.info('没有更多数据了')
                    yield put({
                        type: 'dealData',
                        payload: {
                            end: true
                        },
                    })
                }
            } else {
                message.error(res.msg)
            }
        },
    },
    reducers: {
        dealData (state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
        clearStatus (state, { payload }) {
            return {
                ...state,
                listData: [],
                workType: 0,
                workStatus: 1,
                page: 1,
                pageSize: 20,
                end: true
            }
        },
    }

}

function handData (res) {
    try {
        var pageList = res.data.pageList;
        var i = 0;
        var pageLength = pageList.length;
        var speakListenList = [];
        for (i; i < pageLength; i++) {
            var workList = pageList[i];
            if (workList.sendDate) {
                workList.time = formatDate(workList.sendDate, 'yyyy.MM.dd');
                workList.week = formatDate(workList.sendDate, 'W');
                workList.month = formatDate(workList.sendDate, 'MM-dd');
                workList.hours = formatDate(workList.sendDate, 'hh:mm');
            } else {
                workList.time = formatDate(workList.publishDate, 'yyyy.MM.dd');
                workList.week = formatDate(workList.publishDate, 'W');
                workList.month = formatDate(workList.publishDate, 'MM-dd');
                workList.hours = formatDate(workList.publishDate, 'hh:mm');
            }
            for (var j = 0; j < workList.workList.length; j++) {
                var workContents = workList.workList[j]
                var arr = []
                for (var k = 0; k < workContents.workContents.length; k++) {
                    var item = workContents.workContents[k]
                    if (item.moduleId == 15) {
                        arr.push(item)
                    }
                }
                workContents.workContents = arr
            }
            speakListenList.push(workList)

        }
        var temp = []
        for (var m = 0; m < pageLength; m++) {
            var flag = 0
            for (var n = 0; n < pageList[m].workList.length; n++) {
                var workContents = pageList[m].workList[n]
                if (workContents.workContents.length) {
                    flag = 1
                }
            }
            if (flag === 1) {
                temp.push(pageList[m])
            }
        }
        return temp
    } catch (e) {
        console.log(e)
    }
}

function formatDate (timestamp, fmt) { // timestamp = 1492141656,"W yyyy-MM-dd hh:mm:ss"
    var now = new Date(parseInt(timestamp) * 1000);
    var weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var o = {
        "M+": now.getMonth() + 1, //月份
        "d+": now.getDate(), //日
        "h+": now.getHours(), //小时
        "m+": now.getMinutes(), //分
        "s+": now.getSeconds(), //秒
        "q+": Math.floor((now.getMonth() + 3) / 3), //季度
        "S": now.getMilliseconds(), //毫秒
        "W": weekStr[now.getDay()], //周
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}