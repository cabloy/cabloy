module.exports = app => {
  const dictItems = [
    {
      code: 1,
      title: 'Drafting',
    },
    {
      code: 2,
      title: 'Reviewing',
    },
    {
      code: -1,
      title: 'Reviewed',
    },
    {
      code: -3,
      title: 'Cancelled',
    },
  ];
  const dictLocales = {
    'zh-cn': {
      Drafting: '起草中',
      Reviewing: '审核中',
      Reviewed: '已审核',
      Cancelled: '已取消',
    },
  };
  const dict = {
    atomName: 'AtomStateDefault',
    atomStaticKey: 'dictAtomStateDefault',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return dict;
};
