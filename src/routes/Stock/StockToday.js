import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Button, Icon, Col, Row, Input, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Stock.less';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const { Option } = Select;

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
export default class StockToday extends PureComponent {
  state = {
    expandForm: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'stock/fetchToday',
      payload: {},
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="股票代码">
              {getFieldDecorator('stockCode')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="股票代码">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
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
        logo={<Icon type="area-chart" style={{ fontSize: 32, color: '#00ffff' }} />}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <Table
              loading={ruleLoading}
              dataSource={data.today}
              pagination={data.pagination}
              columns={columns}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
