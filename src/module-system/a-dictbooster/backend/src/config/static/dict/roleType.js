module.exports = app => {
  const dictItems = [
    {
      code: 0,
      title: 'Role',
    },
    {
      code: 1,
      title: 'Organization',
    },
    {
      code: 2,
      title: 'Position',
    },
    {
      code: 3,
      title: 'Level',
    },
    {
      code: 4,
      title: 'Role Template',
    },
    {
      code: 5,
      title: 'OpenAuthScene',
    },
  ];
  const dictLocales = {
    'en-us': {
      OpenAuthScene: 'Open Auth Scene',
    },
    'zh-cn': {
      Role: '角色',
      Organization: '组织',
      Position: '岗位',
      Level: '级别',
      OpenAuthScene: '开放认证场景',
      'Role Template': '角色模版',
    },
  };
  const definition = {
    atomName: 'Role Type',
    atomStaticKey: 'dictRoleType',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return definition;
};
