const schemas = {};
schemas.signin = {
  type: 'object',
  properties: {
    auth: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Your Username/Mobile/Email',
      notEmpty: true,
    },
    password: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Your Password',
      ebParams: {
        secure: true,
      },
      notEmpty: true,
      minLength: 6,
    },
    rememberMe: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'Remember Me',
    },
  },
};
module.exports = schemas;
