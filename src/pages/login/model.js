import * as routerRedux from "react-router-redux";
import { login, getMyInfo } from './service'
import { message } from 'antd'

export default {
  namespace: 'login',

  state: {},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/login') {
          sessionStorage.removeItem('accessToken')
        }
      });
    },
  },

  effects: {
    * login ({ payload, }, { put, call, select }) {
      const data = yield call(login, payload)
      if (data && data.success && data.data && data.data.accessToken) {
        sessionStorage.setItem('accessToken', data.data.accessToken)
        const params = {
          userRole: 2
        }
        const info = yield call(getMyInfo, params)
        if (info && info.success) {
          if (info.data && info.data.length) {
            const user = info.data[0].SchoolName + ' ' + data.data.realName
            sessionStorage.setItem('user', user)
            yield put({
              type: 'app/dealData',
              payload: {
                user
              }
            })
          }
          yield put(routerRedux.push('/list'))
        }
      } else {
        message.error(data.msg || '登录出错，请稍后再试!')
      }
    },
  },

}
