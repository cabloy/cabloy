module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // {{atomClassName}}
  schemas.{{atomClassName}} = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      // Stats
      __groupStats: {
        ebType: 'group-flatten',
        ebTitle: 'Stats',
      },
      detailsCount: {
        type: 'number',
        ebType: 'detailsStat',
        ebTitle: 'Quantity',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
          expression: 'details.length',
        },
        ebAutoSubmit: true,
        ebReadOnly: true,
      },
      // Details
      __groupDetails: {
        ebType: 'group-flatten',
        ebGroupWhole: true,
        ebParams: {
          titleHidden: true,
        },
      },
      details: {
        ebType: 'details',
        ebTitle: 'Details',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
        },
      },
    },
  };
  // {{atomClassName}} search
  schemas.{{atomClassName}}Search = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
