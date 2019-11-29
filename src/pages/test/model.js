
import { query } from './server'
export default {

    namespace: 'test',

    state: {
        butName0: '',
        butName1: ''
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/test') {
                    dispatch({type: 'query'})
                    dispatch({ type: 'dealData', payload: { butName0: 'Hello World!' } })
                }
            });
        },
    },

    effects: {
        *query ({ payload }, { call, put }) {
            const data = yield call(query, payload)
            console.log(data)
        },
    },

    reducers: {

        dealData (state, { payload }) {
            return { ...state, ...payload };
        },

    }

}
