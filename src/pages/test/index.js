import { Button } from 'antd';
import { connect } from 'dva'
import React from "react";

const Index = ({ test, loading, dispatch }) => {
    const click = () => {
        let name = test.butName0
        name = name.split("").reverse().join("")
        dispatch({ type: 'test/dealData', payload: { butName0: name } })
    }
    return <div>
        <Button type="danger" block loading={loading.effects['test/query']} onClick={() => { click() }}>{test.butName0}</Button>
    </div>

}

export default connect(({ test, loading }) => ({ test, loading }))(Index)