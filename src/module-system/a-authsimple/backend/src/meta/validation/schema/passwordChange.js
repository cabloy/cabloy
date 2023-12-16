const schemas = {};
schemas.passwordChange = {
  type: 'object',
  properties: {
    passwordOld: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Old Password',
      ebParams: {
        secure: true,
      },
      notEmpty: true,
      minLength: 6,
    },
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
module.exports = schemas;
