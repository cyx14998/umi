/* global window */
/* global document */
import React from 'react'
import { connect } from 'dva'
import { withRouter } from "react-router";
import './app.less'
import { Card } from 'antd';
import NProgress from 'nprogress'

let lastHref
const App = ({
  children, dispatch, app, loading, location,
}) => {
  const { href } = window.location

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  return (
    <div className="container">
      <Card title={app.appName} style={{ width: '100%' }}>
        {children}
      </Card>
    </div>
  )
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
