import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Tooltip, Icon, Table } from 'antd';
import { Bar, ChartCard, MiniProgress, WaterWave } from '../../components/Charts';
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

    if (detail) {
      infoArray.push(<Description term="股票代码">{detail.code}</Description>);
      infoArray.push(<Description term="股票名称">{detail.name}</Description>);
      infoArray.push(<Description term="当前Diff">{detail.currentDiff}</Description>);
      infoArray.push(<Description term="当前Macd">{detail.currentMacd}</Description>);
      infoArray.push(<Description term="当前股价">{detail.currentPrice}</Description>);
      infoArray.push(<Description term="最高价">{detail.highestPrice}</Description>);
      infoArray.push(<Description term="总增幅">{detail.increaseTotal}%</Description>);
      infoArray.push(<Description term="是否可能金叉">{detail.goldPossible === true ? 'true' : 'false'}</Description>);
    }
    return (infoArray);
  }
  render() {
    const { stock: { macdData, detail: { macdRiskDto } } } = this.props;
    let cycles = [];
    let percentage = '';
    let rate = 0;
    let average = 0;
    if (macdRiskDto) {
      cycles = macdRiskDto.goldCycles;
      rate = macdRiskDto.pricePercentage.toFixed(2);
      average = macdRiskDto.averageRate.toFixed(2);
      percentage = `${average}%`;
    }
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        {this.renderStockInfo()}
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title="股票详情"
        content={description}
      >
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Card bordered={false} >
              <Bar height={230} title="销售额趋势" data={macdData} />
            </Card>
          </Col>
          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <Card bordered={false} >
              <div style={{ textAlign: 'center' }}>
                <WaterWave
                  height={225}
                  title="最高价百分比"
                  percent={rate}
                />
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <Card bordered={false} >
              <ChartCard
                title="平均增幅"
                total={percentage}
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={124}
              >
                <MiniProgress percent={average} strokeWidth={8} target={80} />
              </ChartCard>
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
