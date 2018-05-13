import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import styles from '../../components/StandardTable/index.less';

class StockTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '股票代码',
        dataIndex: 'code',
      },
      {
        title: '股票名称',
        dataIndex: 'name',
      },
      {
        title: '能否金叉',
        dataIndex: 'goldPossible',
      },
      {
        title: '当前MACD',
        dataIndex: 'currentMacd',
      },
      {
        title: '当前收盘(元)',
        dataIndex: 'currentPrice',
      },
      {
        title: '历史最高(元)',
        dataIndex: 'highestPrice',
      },
      {
        title: '当前历史比例（%）',
        dataIndex: 'rate',
      },
      {
        title: 'MACD成长率(%)',
        dataIndex: 'increaseTotal',
      },
      {
        title: 'FIRST DIFF',
        dataIndex: 'currentDiff',
      },
      {
        title: '金叉平均时长(天)',
        dataIndex: 'averageGoldDays',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                服务调用总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StockTable;
