module.exports = app => {
  const schemas = {};
  schemas.authDingtalkadmin = {
    type: 'object',
    properties: {
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Auth Info',
      },
      corpId: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'corpId',
        notEmpty: true,
      },
      ssoSecret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'ssoSecret',
        notEmpty: true,
      },
    },
  };
  return schemas;
};
