module.exports = app => {
  const dictItems = [
    {
      code: 'default',
      title: 'AllowAllFields',
    },
    {
      code: 'whitelist',
      title: 'AllowSpecificFields',
    },
    {
      code: 'blacklist',
      title: 'ConstraintSpecificFields',
    },
    {
      code: 'custom',
      title: 'Custom',
    },
  ];
  const dictLocales = {
    'en-us': {
      AllowAllFields: 'Allow All Fields',
      AllowSpecificFields: 'Allow Specific Fields(Whitelist)',
      ConstraintSpecificFields: 'Constraint Specific Fields(Blacklist)',
    },
    'zh-cn': {
      AllowAllFields: '允许所有字段',
      AllowSpecificFields: '允许指定字段(白名单)',
      ConstraintSpecificFields: '限制指定字段(黑名单)',
      Custom: '自定义',
    },
  };
  const definition = {
    atomName: 'FieldsRightMode',
    atomStaticKey: 'dictFieldsRightMode',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return definition;
};
