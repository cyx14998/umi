/* global window */
/* global document */
import React from 'react'
import { connect } from 'dva'
import { withRouter } from "react-router";
import './app.less'
import NProgress from 'nprogress'
import { appName } from 'utils/config'

let lastHref
const App = ({
  children, dispatch, app, loading, location,
}) => {
  const { href } = window.location
  const { user } = app

  if (lastHref !== href) {
    // window.scrollTo(0, 0);
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }
  const goList = () => {
    dispatch({ type: 'app/gotoList' })
  }
  const quit = () => {
    dispatch({ type: 'app/logOut' })
  }
  if (location.pathname === '/login') {
    return (
      <div className="container">
        {children}
      </div>
    )
  }
  return (
    <div className="container">
      <div className="head-part">
        <div className="head-inner">
          <div className="appName" onClick={() => goList()}>{appName}</div>
          <div className="user-info">
            <span className="name">{user}</span><span className="quit" onClick={() => quit()}>退出</span>
          </div>
        </div>
      </div>
      <div className="children-container">{children}</div>
      <div className="footer">
        {appName}
      </div>
    </div>
  )

}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
