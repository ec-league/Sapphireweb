import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Button, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Stock.less';

const ButtonGroup = Button.Group;

const columns = [
  {
    title: '股票代码',
    dataIndex: 'code',
    align: 'center',
  },
  {
    title: '股票名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '能否金叉',
    dataIndex: 'goldPossible',
    align: 'center',
    render(val) {
      return val === true ? <Icon type="check" /> : <Icon type="close" />;
    },
  },
  {
    title: '当前MACD',
    dataIndex: 'currentMacd',
    align: 'center',
  },
  {
    title: '当前收盘(元)',
    dataIndex: 'currentPrice',
    align: 'center',
  },
  {
    title: '历史最高(元)',
    dataIndex: 'highestPrice',
    align: 'center',
  },
  {
    title: '当前历史比例（%）',
    dataIndex: 'rate',
    align: 'center',
    render(val) {
      const v = val.toFixed(2);
      return `${v}%`;
    },
  },
  {
    title: 'MACD成长率(%)',
    dataIndex: 'increaseTotal',
    align: 'center',
    render(val) {
      const v = val.toFixed(2);
      return `${v}%`;
    },
  },
  {
    title: 'FIRST DIFF',
    dataIndex: 'currentDiff',
    align: 'center',
  },
  {
    title: '金叉平均时长(天)',
    dataIndex: 'averageGoldDays',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'code',
    align: 'center',
    render(val) {
      const url = `/#/stock/stock-detail/${val}`;
      return <span><a href={url} target="_blank">详情</a></span>;
    },
  },
];

@connect(state => ({
  stock: state.stock,
}))
@Form.create()
export default class StockList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'stock/fetchList',
      payload: {},
    });
  }

  render() {
    const { dispatch, stock: { loading: ruleLoading, data } } = this.props;

    const onRefreshCache = () => {
      dispatch({
        type: 'stock/refreshCache',
      });
    };
    const onRefreshData = () => {
      dispatch({
        type: 'stock/refreshData',
      });
    };

    const action = (
      <div>
        <ButtonGroup>
          <Button type="primary" onClick={onRefreshCache}>刷新缓存</Button>
          <Button onClick={onRefreshData}>刷新数据</Button>
        </ButtonGroup>
      </div>
    );

    return (
      <PageHeaderLayout
        title="股票列表页"
        action={action}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={ruleLoading}
              dataSource={data.list}
              pagination={data.pagination}
              columns={columns}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
