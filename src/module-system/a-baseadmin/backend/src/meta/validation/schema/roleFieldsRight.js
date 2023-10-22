module.exports = app => {
  const schemas = {};
  // roleFieldsRight
  schemas.roleFieldsRight = {
    type: 'object',
    properties: {
      // AuthorizationSource
      __groupAuthorizationSource: {
        ebType: 'group-flatten',
        ebTitle: 'AuthorizationSource',
        ebDisplay: {
          expression: 'typeof roleNameBaseLocale!=="undefined"',
        },
      },
      roleNameBaseLocale: {
        ebType: 'atomItem',
        ebTitle: 'From',
        ebDisplay: {
          expression: 'typeof roleNameBaseLocale!=="undefined"',
        },
        ebParams: {
          atomClass: {
            module: 'a-base',
            atomClassName: 'role',
          },
          mode: 'view',
          atomId: 'roleAtomIdBase',
        },
      },
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
            inner: false,
            detail: false,
          },
          mapper: {
            module: 'moduleTarget',
            atomClassName: 'atomClassNameTarget',
          },
        },
        notEmpty: true,
      },
      __groupAuthorizationFieldsRight: {
        ebType: 'group-flatten',
        ebTitle: 'FieldsRight',
        ebParams: {
          titleHidden: true,
        },
      },
      fieldsRight: {
        type: ['string', 'null'],
        ebType: 'component',
        ebTitle: 'FieldsRight',
        ebRender: {
          module: 'a-baseadmin',
          name: 'renderRoleFieldsRight',
        },
        // notEmpty: true,
      },
    },
  };
  // role right search
  schemas.roleFieldsRightSearch = {
    type: 'object',
    properties: {
      atomClassIdTarget: {
        type: 'number',
        ebType: 'atomClassId',
        ebTitle: 'Atom Class',
        ebParams: {
          target: '_self',
          check: {
            inner: false,
            detail: false,
          },
          optional: true,
        },
      },
    },
  };
  return schemas;
};
