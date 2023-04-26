module.exports = app => {
  const schemas = {};
  // roleRight
  schemas.roleRight = {
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
          expression: '_meta.host.mode==="edit" && system===0',
        },
        notEmpty: true,
      },
      atomNameView: {
        ebType: 'text',
        ebTitle: 'Role Name',
        ebDisplay: {
          expression: '_meta.host.mode==="view" || system===1',
        },
        ebComputed: {
          expression: 'atomNameLocale',
          dependencies: ['atomName'],
          immediate: true,
        },
        ebReadOnly: true,
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
          mode: 'select',
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
      // roleIdParent: {
      //   type: 'number',
      //   ebType: 'text',
      //   ebTitle: 'RoleParent',
      //   ebReadOnly: true,
      // },
      roleIdParentView: {
        ebType: 'text',
        ebTitle: 'RoleParent',
        ebDisplay: {
          expression: 'roleIdParent>0',
        },
        ebComputed: {
          expression: 'roleNameParentLocale',
          dependencies: ['roleIdParent'],
          immediate: true,
        },
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
  // role right search
  schemas.roleRightSearch = {
    type: 'object',
    properties: {
      roleTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Role Type',
        ebParams: {
          dictKey: 'a-base:dictRoleType',
          mode: 'select',
        },
        ebOptionsBlankAuto: true,
      },
    },
  };
  return schemas;
};
