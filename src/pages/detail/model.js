import { message } from 'antd'
import { query, start, end, postExamStatus, getStatue } from './service'

export default {
    namespace: 'detail',

    state: {
        detailData: {}, // 接口返回的源数据
        list: [], // 拼接后展示的table数据
        workList: [], // 开始考试 需要的参数
        abMode: 0, // =1时 ab卷模式
        workId: '',
        contentId: '',
        workIds: [], // workId 集合 非AB卷 只有一个workId
        examStatus: 202, // 考试状态（200：未开始考试，201：已经开始考试，202：考试已结束)
    },
    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/detail') {
                    const { abMode, batchId, workId, contentId } = location.query
                    if (abMode && abMode == 1) {
                        dispatch({ type: 'dealData', payload: { abMode, batchId } })
                    } else {
                        dispatch({ type: 'dealData', payload: { workId, contentId, batchId, abMode: 0 } })
                    }
                    const accessToken = sessionStorage.getItem('accessToken')
                    if (accessToken) {
                        dispatch({ type: 'query', payload: { batchId } })
                    }
                }
            });
        },
    },

    effects: {
        *query ({ payload, }, { put, call, select }) {
            const { abMode, workId, contentId } = yield select(_ => _.detail)
            const res = yield call(query, payload)
            if (res && res.success && res.data && res.data.workList) {
                try {
                    let list = []
                    let workList = []
                    let workIds = []
                    let obj = {}
                    let userIds = []
                    let examStatus = 200
                    if (abMode && abMode == 1) {
                        res.data.workList.map((item) => {
                            workIds.push(item.workId)
                            item.workContents = item.workContents[0]
                            workList.push(item)
                            item.workMembers.map((w) => {
                                if (item.reviceObject.indexOf('-') > -1) {
                                    w.className = item.reviceObject.split('-')[0]
                                } else {
                                    w.className = item.reviceObject
                                }
                                w.resourceName = item.workContents.resourceName
                                list.push(w)
                            })
                        })
                        yield put({
                            type: 'dealData',
                            payload: { list, workList, detailData: res.data, workIds, examStatus: res.data.workList[0].examStatus || 200 }
                        })
                    } else {
                        res.data.workList.map((item) => {
                            if (item.workId == workId) {
                                examStatus = item.examStatus
                                obj = item
                                item.workContents.map((w) => {
                                    if (w.contentId == contentId) {
                                        obj.workContents = w
                                    }
                                })
                                item.workMembers.map((w) => {
                                    if (item.reviceObject.indexOf('-') > -1) {
                                        w.className = item.reviceObject.split('-')[0]
                                    } else {
                                        w.className = item.reviceObject
                                    }
                                    w.resourceName = obj.workContents.resourceName
                                    list.push(w)
                                })
                            }
                        })
                        workList.push(obj)
                        yield put({
                            type: 'dealData',
                            payload: { list, workList, detailData: res.data, workIds: [workId], examStatus }
                        })
                    }
                    list.map((item) => {
                        userIds.push(item.userId)
                    })
                    yield put({ type: 'getStatue', payload: { userIds } })
                } catch (e) {
                    message.error(e)
                }
            } else {
                message.error(res.msg)
            }
        },
        *start ({ payload, }, { put, call, select }) {
            const { batchId, workIds } = yield select(_ => _.detail)
            const params = {
                batchId,
                workList: payload
            }
            const res = yield call(start, params)
            if (res && res.success) {
                const examParams = {
                    workIds,
                    batchId,
                    examStatus: 201
                }
                const status = yield call(postExamStatus, examParams)
                if (status && status.success && status.ret == 0) {
                    yield put({ type: 'dealData', payload: { examStatus: examParams.examStatus } })
                } else {
                    message.error(status.msg)
                }
            } else {
                message.error(res.msg)
            }
        },
        *end ({ payload, }, { put, call, select }) {
            const { batchId, workIds } = yield select(_ => _.detail)
            const params = {
                workIds,
                batchId,
                examStatus: 202
            }
            const res = yield call(end, params)
            if (res && res.success) {
                const status = yield call(postExamStatus, params)
                if (status && status.success && status.ret == 0) {
                    yield put({ type: 'dealData', payload: { examStatus: params.examStatus } })
                } else {
                    message.error(status.msg)
                }
            } else {
                message.error(res.msg)
            }
        },
        *getStatue ({ payload, }, { put, call, select }) {
            const { list } = yield select(_ => _.detail)
            const res = yield call(getStatue, payload)
            if (res && res.success) {
                if (res.data && res.data.length) {
                    const nowList = res.data.filter(item => list.map(ele => ele.userId === item.userId));
                    nowList.map((item) => {
                        if (item.className.indexOf('-') > -1) {
                            item.className = item.className.split('-')[0]
                        } else {
                            item.className = item.className
                        }
                    })
                    yield put({ type: 'dealData', payload: { list: nowList } })
                }
            } else {
                message.error(res.msg)
            }
        },
    },
    reducers: {
        clearStatus (state, { payload }) {
            return {
                ...state,
                detailData: {}, // 接口返回的源数据
                list: [], // 拼接后展示的table数据
                workList: [], // 开始考试 需要的参数
                abMode: 0, // =1时 ab卷模式
                workId: '',
                contentId: '',
                workIds: [], // workId 集合 非AB卷 只有一个workId
                examStatus: 202, // 考试状态（200：未开始考试，201：已经开始考试，202：考试已结束) 
            }
        },
        dealData (state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    }
}