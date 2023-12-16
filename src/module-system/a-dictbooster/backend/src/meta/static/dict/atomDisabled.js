const dictItems = [
  {
    code: 0,
    title: 'Enabled',
  },
  {
    code: 1,
    title: 'Disabled',
  },
];
const dictLocales = {
  'zh-cn': {
    Enabled: '已启用',
    Disabled: '已禁用',
  },
};
const definition = {
  atomName: 'AtomDisabledStatus',
  atomStaticKey: 'dictAtomDisabled',
  atomRevision: 0,
  description: '',
  dictItems: JSON.stringify(dictItems),
  dictLocales: JSON.stringify(dictLocales),
  resourceRoles: 'root',
};
module.exports = definition;
