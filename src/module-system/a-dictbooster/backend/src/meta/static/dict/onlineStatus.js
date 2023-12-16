const dictItems = [
  {
    code: 1,
    title: 'Offline',
  },
  {
    code: 2,
    title: 'Online',
  },
];
const dictLocales = {
  'zh-cn': {
    Offline: '离线',
    Online: '在线',
  },
};
const definition = {
  atomName: 'Online Status',
  atomStaticKey: 'dictOnlineStatus',
  atomRevision: 0,
  description: '',
  dictItems: JSON.stringify(dictItems),
  dictLocales: JSON.stringify(dictLocales),
  resourceRoles: 'root',
};
module.exports = definition;
