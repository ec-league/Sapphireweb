import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Table } from 'antd';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
import { WaterWave } from '../../components/Charts';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Stock.less';

const { Description } = DescriptionList;
// const { TabPane } = Tabs;

const columns = [
  {
    title: '金叉起始日期',
    dataIndex: 'startDate',
    align: 'center',
  },
  {
    title: '金叉结束日期',
    dataIndex: 'endDate',
    align: 'center',
  },
  {
    title: '金叉增幅',
    dataIndex: 'increase',
    align: 'center',
    render(val) {
      const v = val.toFixed(2);
      return `${v}%`;
    },
  },
  {
    title: '金叉最高增幅',
    dataIndex: 'highIncrease',
    align: 'center',
    render(val) {
      const v = val.toFixed(2);
      return `${v}%`;
    },
  },
  {
    title: '金叉持续周期',
    dataIndex: 'consistDays',
    align: 'center',
  },
  {
    title: 'Diff',
    dataIndex: 'diff',
    align: 'center',
  },
];

@connect(state => ({
  stock: state.stock,
}))
export default class StockDetail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { stockCode } = this.props.match.params;

    dispatch({
      type: 'stock/detail',
      payload: stockCode,
    });
  }

  renderStockInfo() {
    const { stock: { detail } } = this.props;
    const infoArray = [];

    infoArray.push(<Description term="股票代码">{detail.code}</Description>);
    infoArray.push(<Description term="股票名称">{detail.name}</Description>);
    infoArray.push(<Description term="当前Diff">{detail.currentDiff.toFixed(3)}</Description>);
    infoArray.push(<Description term="当前Macd">{detail.currentMacd.toFixed(3)}</Description>);
    infoArray.push(<Description term="当前股价">{detail.currentPrice}元</Description>);
    infoArray.push(<Description term="最高价">{detail.highestPrice}元</Description>);
    infoArray.push(<Description term="总增幅">{detail.increaseTotal}%</Description>);
    infoArray.push(<Description term="是否可能金叉">{detail.goldPossible === true ? 'true' : 'false'}</Description>);
    return (infoArray);
  }
  render() {
    const { stock: {
      detail: { macdRiskDto }, macdData, cols } } = this.props;
    let cycles = [];
    let rate = 0;
    if (macdRiskDto) {
      cycles = macdRiskDto.goldCycles;
      rate = macdRiskDto.pricePercentage.toFixed(0);
    }
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        {this.renderStockInfo()}
      </DescriptionList>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>平均增幅</div>
          <div className={styles.heading}>{macdRiskDto.averageRate.toFixed(2)}%</div>
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout
        title="股票详情"
        content={description}
        extraContent={extra}
      >
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xl={16} lg={12} md={12} sm={24} xs={24}>
            <Card bordered={false} >
              <Chart height={250} data={macdData} scale={cols} forceFit>
                <Axis name="index" />
                <Axis name="value" label={{ formatter: val => `${val}` }} />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="index*value" size={2} />
                <Geom type="point" position="index*value" size={4} shape="circle" style={{ stroke: '#fff', lineWidth: 1 }} />
              </Chart>
            </Card>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <Card bordered={false} >
              <div style={{ textAlign: 'center' }}>
                <WaterWave
                  height={245}
                  title="最高价百分比"
                  percent={rate}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Card title="Macd周期详情" >
          <Table
            dataSource={cycles}
            columns={columns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
