module.exports = app => {
  const schemas = {};
  schemas.passwordReset = {
    type: 'object',
    properties: {
      passwordNew: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New Password',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      passwordNewAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'New Password Again',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        const: { $data: '1/passwordNew' },
      },
    },
  };
  return schemas;
};
