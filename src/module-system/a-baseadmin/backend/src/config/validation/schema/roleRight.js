module.exports = app => {
  const schemas = {};
  // roleRight
  schemas.roleRight = {
    type: 'object',
    properties: {
      // AuthorizationObjective
      __groupAuthorizationObjective: {
        ebType: 'group-flatten',
        ebTitle: 'AuthorizationObjective',
      },
      atomClass: {
        type: 'object',
        ebType: 'atomClass',
        ebTitle: 'Atom Class',
        notEmpty: true,
        ebParams: {
          simple: 0,
          inner: null,
        },
      },
    },
  };
  // role right search
  schemas.roleRightSearch = {
    type: 'object',
    properties: {
      // todo:
    },
  };
  return schemas;
};
