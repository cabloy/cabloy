module.exports = app => {
  const schemas = {};
  schemas.emailConfirm = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        ebReadOnly: true,
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        notEmpty: true,
        format: 'email',
        'x-exists': true,
      },
    },
  };
  return schemas;
};
