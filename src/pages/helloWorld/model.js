
export default {

    namespace: 'helloword',

    state: {
        butName0: '',
        butName1: ''
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/helloworld') {
                    dispatch({ type: 'dealData', payload: { butName0: 'Hello World!' } })
                }
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
