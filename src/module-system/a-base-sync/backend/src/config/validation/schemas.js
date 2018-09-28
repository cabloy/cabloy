module.exports = app => {
  const schemas = {};
  // user
  schemas.user = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
        'x-exists': true,
      },
      realName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Realname',
        notEmpty: true,
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        notEmpty: true,
        format: 'email',
        'x-exists': true,
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        notEmpty: true,
        'x-exists': true,
      },
      motto: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Motto',
      },
      locale: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Locale',
        ebOptionsUrl: '/a/base/base/locales',
        ebOptionsUrlParams: null,
      },
    },
  };

  return schemas;
};
