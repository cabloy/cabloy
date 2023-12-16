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
    // mobile: {
    //   type: 'string',
    //   ebType: 'text',
    //   ebTitle: 'Mobile',
    //   notEmpty: true,
    //   'x-exists': true,
    // },
    password: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Password',
      ebParams: {
        secure: true,
      },
      notEmpty: true,
      minLength: 6,
    },
    passwordAgain: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Password Again',
      ebParams: {
        secure: true,
      },
      notEmpty: true,
      const: { $data: '1/password' },
    },
  },
};
module.exports = schemas;
