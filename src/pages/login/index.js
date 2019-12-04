import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, message } from 'antd'
import styles from './index.less'
import logo from 'img/logo.png'

const FormItem = Form.Item

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      if (!values.userName){
        message.error('请输入老师账号');
        return
      }
      if (!values.passWord) {
        message.error('请输入登录密码');
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  return (
    <div className={styles.login}>
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt="logo" src={logo} />
          <span>习习向上监考系统</span>
        </div>
        <form className={styles.inputWrapper}>
          <FormItem>
            <div>老师帐号</div>
            {getFieldDecorator('userName', {
            })(<Input onPressEnter={handleOk} className={styles.inputItem}/>)}
          </FormItem>
          <FormItem>
            <div>登录密码</div>
            {getFieldDecorator('passWord', {
            })(<Input type="password" onPressEnter={handleOk} className={styles.inputItem}/>)}
          </FormItem>
          <Row>
            <Button type="primary" className={styles.loginBtn} onClick={handleOk} loading={loading.effects.login}>
              登录
          </Button>
          </Row>

        </form>
      </div>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
