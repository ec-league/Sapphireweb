import request from '../utils/request';

export async function queryStockToday() {
  return request('/api/stock/today.ep');
}

export async function queryStockList() {
  return request('/api/stock/list.ep');
}

export async function refreshStockCache() {
  return request('/api/stock/cache/refresh.ep');
}

export async function refreshStockData() {
  return request('/api/stock/data/update/stat.ep');
}

export async function queryStockDetail(params) {
  const url = `/api/stock/info.ep?code=${params}`;
  return request(url);
}
