module.exports = app => {
  const dictItems = [
    {
      code: 0,
      title: 'Role',
      options: {
        icon: { f7: ':role:role' },
      },
    },
    {
      code: 1,
      title: 'Organization',
      options: {
        icon: { f7: ':role:organization' },
      },
    },
    {
      code: 2,
      title: 'Position',
      options: {
        icon: { f7: ':role:position' },
      },
    },
    {
      code: 3,
      title: 'Level',
      options: {
        icon: { f7: ':role:level' },
      },
    },
    {
      code: 4,
      title: 'Relation',
      options: {
        icon: { f7: ':role:relation' },
      },
    },
    {
      code: 5,
      title: 'Role Template',
      options: {
        icon: { f7: ':role:template' },
      },
    },
    {
      code: 6,
      title: 'OpenAuthScope',
      options: {
        icon: { f7: ':role:shield-key' },
      },
    },
  ];
  const dictLocales = {
    'en-us': {
      OpenAuthScope: 'Open Auth Scope',
    },
    'zh-cn': {
      Role: '角色',
      Organization: '组织',
      Position: '岗位',
      Level: '级别',
      Relation: '关系',
      OpenAuthScope: '开放认证范围',
      'Role Template': '角色模版',
    },
  };
  const definition = {
    atomName: 'Role Type',
    atomStaticKey: 'dictRoleType',
    atomRevision: 2,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return definition;
};
