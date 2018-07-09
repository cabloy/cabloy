module.exports = app => {
  const schemas = {};
  // role
  schemas.role = {
    type: 'object',
    properties: {
      roleName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Role name',
        notEmpty: true,
      },
      leader: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Leader',
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
    },
  };
  // auth
  schemas.auth = {
    type: 'object',
    properties: {
      addRole: {
        type: 'boolean',
        ebType: 'toggle',
      },
      addUser: {
        type: 'boolean',
        ebType: 'toggle',
      },
      successRedirect: {
        type: 'boolean',
        ebType: 'toggle',
        default: true,
      },
      successReturnToOrRedirect: {
        type: 'boolean',
        ebType: 'toggle',
        default: true,
      },
      clientID: {
        type: 'string',
        ebType: 'text',
      },
      clientSecret: {
        type: 'string',
        ebType: 'text',
      },
    },
  };
  return schemas;
};
