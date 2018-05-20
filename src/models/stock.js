import { message } from 'antd';
import { queryStockList, refreshStockCache, refreshStockData, queryStockDetail, queryStockToday } from '../services/stock';


export default {
  namespace: 'stock',

  state: {
    data: {
      list: [],
      today: [],
      pagination: {},
    },
    detail: {
      currentDiff: 0,
      currentMacd: 0,
      goldPossible: false,
      macdRiskDto: {
        pricePercentage: 0,
        averageRate: 0,
      },
    },
    macdData: [],
    loading: true,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryStockList, payload);

      if (response === null || response.returnCode !== 200) {
        message.error(response.returnMessage);
      } else {
        const pageSize = 10;

        const result = {
          list: response.data,
          pagination: {
            total: response.data.length,
            pageSize,
          },
        };
        yield put({
          type: 'saveTaskList',
          payload: result,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchToday({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryStockToday, payload);

      if (response === null || response.returnCode !== 200) {
        message.error(response.returnMessage);
      } else {
        const pageSize = 10;

        const result = {
          today: response.data,
          pagination: {
            total: response.data.length,
            pageSize,
          },
        };
        yield put({
          type: 'saveTaskList',
          payload: result,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *refreshCache({ payload }, { call }) {
      const response = yield call(refreshStockCache, payload);

      console.log('response=', response);
      if (response === null) {
        message.error('刷新失败');
      } else {
        message.success('刷新成功');
      }
    },
    *refreshData({ payload }, { call }) {
      const response = yield call(refreshStockData, payload);

      console.log('response=', response);
      if (response === null) {
        message.error('刷新失败');
      } else {
        message.success('刷新成功');
      }
    },
    *detail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryStockDetail, payload);
      if (response === null || response.returnCode !== 200) {
        message.error(response.returnMessage);
      } else {
        yield put({
          type: 'saveTaskDetail',
          payload: response.data,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveTaskList(state, action) {
      const s = state;
      s.data = action.payload;
      return {
        ...state,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveTaskDetail(state, action) {
      const s = state;
      s.detail = action.payload;
      const cycles = action.payload.macdRiskDto.goldCycles;
      const macdData = [];
      const cols = {
        index: { range: [0, 1] },
        value: {
          min: -10,
          alias: '增幅',
          formatter: (val) => {
            return `${val.toFixed(2)}%`;
          },
        },
      };
      for (let i = 0; i < cycles.length; i += 1) {
        macdData.push({
          index: `${i + 1}`,
          value: cycles[i].increase,
        });
      }
      s.macdData = macdData;
      s.cols = cols;
      return {
        ...state,
      };
    },
  },
};
