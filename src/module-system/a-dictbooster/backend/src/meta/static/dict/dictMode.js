const dictItems = [
  {
    code: 0,
    title: 'Array',
  },
  {
    code: 1,
    title: 'Tree',
  },
];
const dictLocales = {
  'zh-cn': {
    Array: '数组',
    Tree: '树形',
  },
};
const definition = {
  atomName: 'DictMode',
  atomStaticKey: 'dictMode',
  atomRevision: 0,
  description: '',
  dictItems: JSON.stringify(dictItems),
  dictLocales: JSON.stringify(dictLocales),
  resourceRoles: 'root',
};
module.exports = definition;
