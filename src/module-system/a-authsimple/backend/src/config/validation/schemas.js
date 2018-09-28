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
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/password' },
      },
    },
  };
  schemas.signin = {
    type: 'object',
    properties: {
      auth: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your mobile/email',
        notEmpty: true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember me',
      },
    },
  };
  schemas.reset = {
    type: 'object',
    properties: {
      passwordOld: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Old password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordNew: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordNewAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/passwordNew' },
      },
    },
  };
  return schemas;
};
