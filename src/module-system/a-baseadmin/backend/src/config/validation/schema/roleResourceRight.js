module.exports = app => {
  const schemas = {};
  // roleResourceRight
  schemas.roleResourceRight = {
    type: 'object',
    properties: {
      // nothing
    },
  };
  // role Resource right search
  schemas.roleResourceRightSearch = {
    type: 'object',
    properties: {
      resourceName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Resource Name',
        ebSearch: {
          combine: {
            actionModule: 'a-baseadmin',
            actionComponent: 'combineSearch',
            name: 'resourceName',
          },
        },
      },
      atomClassIdTarget: {
        type: 'number',
        ebType: 'atomClassId',
        ebTitle: 'Resource Class',
        ebParams: {
          target: '_self',
          check: {
            itemOnly: false,
            resource: true,
          },
          optional: true,
        },
      },
    },
  };
  return schemas;
};
