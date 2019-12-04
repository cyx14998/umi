import { Table, BackTop, message, Modal, Icon } from 'antd';
import { connect } from 'dva'
import React from "react";
import styles from './index.less'
import start from 'img/icon-start.png'
import startNo from 'img/icon-start-no.png'
import end from 'img/icon-end.png'
import endNo from 'img/icon-end-no.png'

const { confirm } = Modal;
message.config({
    duration: 1.5,
    maxCount: 1,
    top: 60,
});

class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount () {
        this.timerID = setInterval(() => {
            const { dispatch, loading } = this.props
            const { list } = this.props.detail
            if (loading.effects['detail/getStatue'] || !list.length) return
            let userIds = []
            list.map((item) => {
                userIds.push(item.userId)
            })
            dispatch({ type: 'detail/getStatue', payload: { userIds } })
        }, 1000 * 10);
    }
    componentWillUnmount () {
        const { dispatch } = this.props
        clearInterval(this.timerID)
        dispatch({ type: 'detail/clearStatus' })
    }
    startTest = () => {
        const { workList, list } = this.props.detail
        const { dispatch, loading } = this.props
        workList.map((item) => {
            item.workMembers.map((w) => {
                delete w.workId
                delete w.className
                delete w.classId
            })
        })
        confirm({
            title: '是否开始考试?',
            width: 300,
            okText: '确定开始',
            cancelText: '取消',
            // confirmLoading: loading.effects['detail/start'],
            onOk () {
                dispatch({ type: 'detail/start', payload: { workList } })
                if (loading.effects['detail/getStatue'] || !list.length) return
                let userIds = []
                list.map((item) => {
                    userIds.push(item.userId)
                })
                dispatch({ type: 'detail/getStatue', payload: { userIds } })
            }
        });
    }
    endTest = () => {
        const { workList, list } = this.props.detail
        const { dispatch, loading } = this.props
        workList.map((item) => {
            item.workMembers.map((w) => {
                delete w.workId
                delete w.className
                delete w.classId
            })
        })
        confirm({
            title: '是否结束考试?',
            width: 300,
            okText: '确定结束',
            cancelText: '取消',
            onOk () {
                dispatch({ type: 'detail/end', payload: { workList } })
                // if (loading.effects['detail/getStatue'] || !list.length) return
                // let userIds = []
                // list.map((item) => {
                //     userIds.push(item.userId)
                // })
                // dispatch({ type: 'detail/getStatue', payload: { userIds } })
            }
        });
    }
    render () {
        const { loading } = this.props
        const { list, detailData = {}, examStatus } = this.props.detail
        const columns = [
            {
                title: '账号',
                dataIndex: 'userId',
                key: 'userId',
                render: (text) => text || '-'
            },
            {
                title: '学号',
                dataIndex: 'studentNo',
                key: 'studentNo',
                render: (text) => text || '-'
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                key: 'userName',
                width: 100
            },
            {
                title: '所在班级',
                dataIndex: 'className',
                key: 'className',
            },
            {
                title: '连接状态',
                dataIndex: 'connectStatus',
                key: 'connectStatus',
                render: (text) => {
                    if (!text) return '-'
                    if (text == 100) {
                        return <span style={{ color: '#ccc' }}>未连接</span>
                    }
                    return <span>已连接</span>
                }
            },
            {
                title: '考试状态',
                dataIndex: 'statusCode',
                key: 'statusCode',
                render: (text) => {
                    let dom = ''
                    switch (text) {
                        case 601:
                            dom = <span style={{ color: '#ccc' }}>未连接</span>
                            break;
                        case 602:
                            dom = <span style={{ color: '#00ba90' }}>已登录</span>
                            break;
                        case 603:
                            dom = <span style={{ color: '#ccc' }}>已就绪</span>
                            break;
                        case 604:
                            dom = <span style={{ color: '#00ba90' }}>答题中</span>
                            break;
                        case 605:
                            dom = <span style={{ color: '#00ba90' }}>已完成<Icon type="check" style={{ color: '#00ba90' }} /></span>
                            break;
                        case 701:
                            dom = <span style={{ color: '#ff4141' }}>设备异常</span>
                            break;
                        default:
                            dom = '-'
                            break;
                    }
                    return dom
                }
            },
            {
                title: '试卷名称',
                dataIndex: 'resourceName',
                key: 'resourceName',
                width: 250,
                render: (text) => {
                    if (text) {
                        if (text.length > 16) {
                            return text.substring(0, 15)
                        } else {
                            return text
                        }
                    }
                    return '-'
                }
            },
            {
                title: '考试进度',
                dataIndex: 'progress',
                key: 'progress',
                render: (text) => text || '-'
            },
            {
                title: '考试用时',
                dataIndex: 'examTime',
                key: 'examTime',
                render: (text) => {
                    if (text == -1 || !text) {
                        return '-'
                    }
                    text = Math.floor((text / 1000) / 60)
                    return text + '分钟'
                }
            },
            {
                title: '最后更新',
                dataIndex: 'updateDate',
                key: 'updateDate',
                render: (text) => {
                    if (text) {
                        return text.split(' ')[1]
                    }
                    return '-'
                }
            },
        ]
        /* 考试是否状态（200：未开始考试，201：已经开始考试，202：考试已结束) */
        let startStatus = 'gray'
        let endStatus = 'gray'
        if (examStatus == 200) {
            startStatus = ''
        }
        if (examStatus == 201) {
            endStatus = ''
        }

        return (
            <div className={styles.detailPart}>
                <div className={styles.title}>
                    <div className={styles.name}>
                        {(detailData.sendDate && detailData.sendDate !== detailData.publishDate) ? <span className={styles.setTimes}>[定时布置] &nbsp;&nbsp;</span> : null}
                        {(detailData.abMode && detailData.abMode == 1) ? <span className={styles.abMode}>【A/B卷】</span> : null}
                        【考】{detailData.workName}</div>
                    <div className={styles.btns}>
                        {startStatus == 'gray' ?
                            <div className={styles.btn + ' ' + styles.btnDisabled}><img src={startNo} alt="" /> 开始考试</div> :
                            <div className={styles.btn + ' ' + startStatus} onClick={this.startTest}><img src={start} alt="" /> 开始考试</div>
                        }
                        {endStatus == 'gray' ?
                            <div className={styles.btn + ' ' + styles.btnDisabled}><img src={endNo} alt="" /> 结束考试</div> :
                            <div className={styles.btn + ' ' + endStatus} onClick={this.endTest}><img src={end} alt="" /> 结束考试</div>
                        }
                    </div>
                </div>
                <div className={styles.table}>
                    <Table
                        className={styles.tableStyle}
                        dataSource={list}
                        columns={columns}
                        rowKey={(record, index) => index}
                        loading={loading.effects['detail/query'] || loading.effects['detail/start'] || loading.effects['detail/end']}
                        pagination={false}
                    />
                </div>
                <BackTop />
            </div>
        )
    }
}

export default connect(({ detail, loading }) => ({ detail, loading }))(Detail)