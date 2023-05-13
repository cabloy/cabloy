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
      atomClassIdTarget: {
        type: 'number',
        ebType: 'atomClassId',
        ebTitle: 'Atom Class',
        ebParams: {
          target: '_self',
          check: {
            enableRight: true,
          },
          mapper: {
            module: 'moduleTarget',
            atomClassName: 'atomClassNameTarget',
          },
        },
        notEmpty: true,
      },
      action: {
        type: 'number',
        ebType: 'component',
        ebTitle: 'Atom Action',
        ebRender: {
          module: 'a-baseadmin',
          name: 'renderRoleRightAction',
        },
        notEmpty: true,
      },
      __groupAuthorizationDataScope: {
        ebType: 'group-flatten',
        ebTitle: 'DataScope',
        ebParams: {
          titleHidden: true,
        },
      },
      scope: {
        type: ['number', 'array'],
        ebType: 'component',
        ebTitle: 'DataScopeTitle',
        ebRender: {
          module: 'a-baseadmin',
          name: 'renderRoleRightScope',
        },
        // notEmpty: true,
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
