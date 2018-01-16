import request from '../utils/request';

export async function queryStockList() {
  return request('/api/stock-list');
}
