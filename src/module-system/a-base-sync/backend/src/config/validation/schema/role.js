module.exports = app => {
  const schemas = {};
  // role
  schemas.role = {
    type: 'object',
    properties: {
      // title
      __groupTitle: {
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Role Name',
        ebDisplay: {
          host: {
            mode: 'edit',
          },
        },
        notEmpty: true,
      },
      atomNameView: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Role Name',
        ebDisplay: {
          host: {
            mode: 'view',
          },
        },
        ebComputed: {
          expression: 'atomNameLocale',
          dependencies: ['atomName'],
          immediate: true,
        },
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      roleTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Role Type',
        ebOptionsBlankAuto: true,
        ebParams: {
          dictKey: 'a-base:dictRoleType',
          mode: 'tree',
        },
        notEmpty: {
          ignoreZero: true,
        },
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      leader: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Leader',
      },
      // config
      __groupConfig: {
        ebType: 'group-flatten',
        ebTitle: 'Config',
      },
      roleConfig: {
        type: ['string', 'null'],
        ebType: 'json',
        ebTitle: 'Config',
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      roleIdParent: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'RoleParent',
        ebReadOnly: true,
      },
      catalog: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Catalog',
        ebReadOnly: true,
      },
      system: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'System',
        ebReadOnly: true,
      },
    },
  };
  // role search
  schemas.roleSearch = {
    type: 'object',
    properties: {
      roleTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Role Type',
        ebParams: {
          dictKey: 'a-base:dictRoleType',
          mode: 'tree',
        },
        ebOptionsBlankAuto: true,
      },
    },
  };
  return schemas;
};
