module.exports = app => {
  const dictItems = [
    {
      code: 0,
      title: 'Drafting',
    },
    {
      code: 1,
      title: 'Reviewing',
    },
    {
      code: 2,
      title: 'Reviewed',
    },
  ];
  const dictLocales = {
    'zh-cn': {
      Drafting: '起草中',
      Reviewing: '审核中',
      Reviewed: '已审核',
    },
  };
  const dict = {
    atomName: 'AtomStateDraft',
    atomStaticKey: 'dictAtomStateDraft',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return dict;
};
