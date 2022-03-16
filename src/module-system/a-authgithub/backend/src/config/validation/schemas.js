module.exports = app => {
  const schemas = {};
  schemas.authGithub = {
    type: 'object',
    properties: {
      __groupConfigInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Config Info',
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        notEmpty: true,
      },
      clientID: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Client ID',
        notEmpty: true,
      },
      clientSecret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Client Secret',
        notEmpty: true,
      },
    },
  };
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
  return schemas;
};
