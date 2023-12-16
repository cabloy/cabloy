const dictItems = [
  {
    code: 0,
    title: 'Auto Online',
  },
  {
    code: 1,
    title: 'Login',
  },
];
const dictLocales = {
  'zh-cn': {
    'Auto Online': '自动上线',
    Login: '登录',
  },
};
const dict = {
  atomName: 'Login Type',
  atomStaticKey: 'dictLoginType',
  atomRevision: 0,
  description: '',
  dictItems: JSON.stringify(dictItems),
  dictLocales: JSON.stringify(dictLocales),
  resourceRoles: 'root',
};
module.exports = dict;
