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
      ebParams: {
        inputType: 'tel',
      },
      ebTitle: 'Phone Number',
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
      ebParams: {
        inputType: 'tel',
      },
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
schemas.mobileVerify = {
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Username',
      ebReadOnly: true,
    },
    mobile: {
      type: 'string',
      ebType: 'text',
      ebParams: {
        inputType: 'tel',
      },
      ebTitle: 'Phone Number',
      notEmpty: true,
      'x-exists': true,
    },
  },
};
module.exports = schemas;
