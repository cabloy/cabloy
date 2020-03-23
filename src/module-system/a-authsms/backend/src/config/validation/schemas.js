module.exports = app => {
  const schemas = {};
  schemas.signup = {
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
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        notEmpty: true,
        'x-exists': true,
      },
    },
  };
  schemas.signin = {
    type: 'object',
    properties: {
      mobile: {
        type: 'string',
        ebType: 'text',
        ebInputType: 'tel',
        ebTitle: 'Phone Number',
        notEmpty: true,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember Me',
      },
    },
  };

  return schemas;
};

