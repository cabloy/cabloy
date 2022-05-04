module.exports = app => {
  const dictItems = [
    {
      code: 1,
      title: 'LayoutMobile',
    },
    {
      code: 2,
      title: 'LayoutPC',
    },
    {
      code: 3,
      title: 'AtomList',
    },
    {
      code: 4,
      title: 'AtomItem',
    },
    {
      code: 5,
      title: 'DetailList',
    },
    {
      code: 6,
      title: 'DetailItem',
    },
  ];
  const dictLocales = {
    'en-us': {
      LayoutMobile: 'Mobile Layout',
      LayoutPC: 'PC Layout',
      AtomList: 'Data List',
      AtomItem: 'Data Item',
      DetailList: 'Detail List',
      DetailItem: 'Detail Item',
    },
    'zh-cn': {
      LayoutMobile: '移动布局',
      LayoutPC: 'PC布局',
      AtomList: '数据列表',
      AtomItem: '数据条目',
      DetailList: '明细列表',
      DetailItem: '明细条目',
    },
  };
  const definition = {
    atomName: 'Layout Type',
    atomStaticKey: 'dictLayoutType',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return definition;
};
