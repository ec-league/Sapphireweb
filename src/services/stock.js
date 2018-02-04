import request from '../utils/request';

export async function queryStockList() {
  console.log('query stock list');
  return request('/api/stock/today.ep');
}
