module.exports = app => {
  const dictItems = [
    {
      code: 0,
      title: 'Role',
      icon: { f7: ':role:role' },
    },
    {
      code: 1,
      title: 'Organization',
      icon: { f7: ':role:organization' },
    },
    {
      code: 2,
      title: 'Position',
      icon: { f7: ':role:position' },
    },
    {
      code: 3,
      title: 'Level',
      icon: { f7: ':role:level' },
    },
    {
      code: 4,
      title: 'Relation',
      icon: { f7: ':role:relation' },
    },
    {
      code: 5,
      title: 'Role Template',
      icon: { f7: ':role:template' },
    },
    {
      code: 6,
      title: 'OpenAuthScene',
      icon: { f7: ':role:shield-key' },
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
      Relation: '关系',
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
