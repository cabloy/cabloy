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
