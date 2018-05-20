const menuData = [{
  name: '股票信息',
  icon: 'table',
  path: 'stock',
  children: [{
    name: '股票列表页',
    path: 'stock-list',
  }, {
    name: '今日推荐',
    path: 'stock-today',
  }],
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
