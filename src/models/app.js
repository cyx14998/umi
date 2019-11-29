
export default {

    namespace: 'app',

    state: {
        appName: ''
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                dispatch({ type: 'dealData', payload: { appName: '习习向上监考系统' } })
            });
        },
    },

    effects: {
    },

    reducers: {

        dealData (state, { payload }) {
            return { ...state, ...payload };
        },

    }

}
