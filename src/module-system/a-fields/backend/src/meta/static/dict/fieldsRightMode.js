const dictItems = [
  {
    code: 'allowAllFieldsRead',
    title: 'AllowAllFieldsRead',
  },
  {
    code: 'allowAllFieldsReadWrite',
    title: 'AllowAllFieldsReadWrite',
  },
  {
    code: 'allowSpecificFields',
    title: 'AllowSpecificFields',
  },
  {
    code: 'custom',
    title: 'Custom',
  },
];
const dictLocales = {
  'en-us': {
    AllowAllFieldsRead: 'Allow All Fields(Only Read)',
    AllowAllFieldsReadWrite: 'Allow All Fields(Read/Write)',
    AllowSpecificFields: 'Allow Specific Fields',
  },
  'zh-cn': {
    AllowAllFieldsRead: '允许所有字段(只读)',
    AllowAllFieldsReadWrite: '允许所有字段(读写)',
    AllowSpecificFields: '允许指定字段',
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
module.exports = definition;
