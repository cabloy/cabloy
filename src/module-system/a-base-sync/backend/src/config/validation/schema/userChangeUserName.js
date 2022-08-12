module.exports = app => {
  const schemas = {};
  schemas.userChangeUserName = {
    type: 'object',
    properties: {
      userNameOld: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'UsernameOld',
        ebReadOnly: true,
      },
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'UsernameNew',
        notEmpty: true,
        'x-exists': true,
      },
    },
  };
  return schemas;
};
