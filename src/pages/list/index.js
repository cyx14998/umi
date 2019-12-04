import { Button, List, BackTop, message, Spin } from 'antd';
import { connect } from 'dva'
import React from "react";
import styles from './index.less'
import * as routerRedux from "react-router-redux";
import queryString from 'query-string'
import img1 from 'img/icon-img1.png'
import noStart from 'img/icon-noStart.png'
import doing from 'img/icon-doing.png'
message.config({
    duration: 1.5,
    maxCount: 1,
    top: 60,
});

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillUnmount () {
        const { dispatch } = this.props
        dispatch({ type: 'list/clearStatus' })
    }
    onLoadMore = () => {
        const { dispatch } = this.props
        const { end } = this.props.list
        if (end) return
        dispatch({ type: 'list/query' })
    }
    checkABStatus = (item) => {
        const { dispatch } = this.props
        if (!item.abMode || item.abMode != 1) return
        if (item.sendDate && item.sendDate * 1000 > new Date().getTime()) {
            message.info('该作业还未开始!')
            return
        }
        dispatch(
            routerRedux.push({
                pathname: '/detail',
                search: queryString.stringify({
                    batchId: item.batchId,
                    abMode: 1
                })
            })
        )
    }
    checkStatus = (item, sItem, fItem) => {
        const { dispatch } = this.props
        if (item.abMode && item.abMode === 1) return
        if (item.sendDate && item.sendDate * 1000 > new Date().getTime()) {
            message.info('该作业还未开始!')
            return
        }
        dispatch(
            routerRedux.push({
                pathname: '/detail',
                search: queryString.stringify({
                    batchId: item.batchId,
                    workId: sItem.workId,
                    contentId: fItem.contentId
                })
            })
        )
    }
    render () {
        const { loading } = this.props
        const { listData, end } = this.props.list
        const loadMore =
            !end ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 12,
                        marginBottom: 12,
                        height: 32,
                        lineHeight: '32px',
                    }}
                >
                    <Button onClick={this.onLoadMore} loading={loading.effects['list/query']}>加载更多</Button>
                </div>
            ) : null;
        return <div className={styles.listPart}>
            <List
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={listData}
                renderItem={(item, index) => (
                    <List.Item className={styles.list} key={index}>
                        <div className={styles.listHead}>
                            <div className={styles.line}></div>
                            <div className={styles.title}>
                                {(item.sendDate && item.sendDate !== item.publishDate) ? <span className={styles.setTimes}>[定时布置] &nbsp;&nbsp;</span> : null}
                                {item.month}（{item.week}）{item.hours}
                                {(item.abMode && item.abMode == 1) ? <span className={styles.abMode}>【A/B卷】</span> : null}
                                {item.workName}
                            </div>
                        </div>
                        <div className={styles.itemList} onClick={() => { this.checkABStatus(item) }}>
                            {item.workList && item.workList.length ? item.workList.map(sItem => {
                                return sItem.workContents && sItem.workContents.length ? sItem.workContents.map((fItem, fIndex) => {
                                    return (
                                        <div className={styles.item} key={index + ' ' + fIndex} onClick={() => { this.checkStatus(item, sItem, fItem) }}>
                                            <img src={img1} alt="" className={styles.img1} />
                                            <div className={styles.classTitle}>【考】{fItem.resourceName}</div>
                                            <div className={styles.className}>{sItem.reviceObject}</div>
                                            {
                                                (item.sendDate && item.sendDate * 1000 > new Date().getTime()) ?
                                                    (
                                                        <div className={styles.status + ' ' + styles.noStart}>
                                                            <img src={noStart} alt="" className={styles.statusImg} />
                                                            未开始
                                                        </div>
                                                    ) : (
                                                        <div className={styles.status}>
                                                            <img src={doing} alt="" className={styles.statusImg} />
                                                            进行中
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    )
                                }) : ''
                            }) : ''}
                        </div>
                    </List.Item>
                )}
            >
            </List >
            <BackTop />
            {loading.effects['list/query'] && <div className="mask">
                <Spin size='large' />
            </div>}
        </div>
    }
}

export default connect(({ list, loading }) => ({ list, loading }))(Index)