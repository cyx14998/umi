
import * as routerRedux from "react-router-redux";

export default {

    namespace: 'app',

    state: {
        user: '',
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname !== '/login') {
                    dispatch({ type: 'login' })
                }
            });
        },
    },

    effects: {
        *login ({ payload, }, { put, call }) {
            if (sessionStorage.getItem('user')) {
                yield put({
                    type: 'dealData',
                    payload: { user: sessionStorage.getItem('user') }
                })
            }
            if (!sessionStorage.getItem('accessToken')) {
                yield put(routerRedux.push('/login'))
            }
        },
        *logOut ({ payload, }, { put, call }) {
            yield put(routerRedux.push('/login'))
        },
        *gotoList ({ payload, }, { put, call }) {
            yield put(routerRedux.push('/list'))
        },
    },

    reducers: {
        dealData (state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    }

}
