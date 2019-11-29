/**
 * title: Hello World Page
 */
import { Button } from 'antd';
import { connect } from 'dva'
import React from "react";
import * as routerRedux from "react-router-redux";

const Index = ({ helloword, dispatch, loading }) => {
    const click = () => {
        console.log(loading)
        let name = helloword.butName0
        name = name.split("").reverse().join("")
        dispatch({ type: 'helloword/dealData', payload: { butName0: name } })
    }
    const gotoTest = () => {
        dispatch(
            routerRedux.push({
                pathname: 'test'
            })
        )
    }
    return <div>
        <Button type="primary" block onClick={() => { click() }}>{helloword.butName0}</Button>
        <Button type="link" block onClick={() => { gotoTest() }}>
            Link
        </Button>
    </div>

}

export default connect(({ helloword, loading }) => ({ helloword, loading }))(Index)