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
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
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
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      roleTypeCode: {
        type: 'string',
        ebType: 'resourceType',
        ebTitle: 'Role Type',
        ebOptionsBlankAuto: true,
        notEmpty: true,
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
    },
  };
  // role search
  schemas.roleSearch = {
    type: 'object',
    properties: {},
  };
  return schemas;
};
