module.exports = app => {
  const schemas = {};
  // dict
  schemas.dict = {
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
      dictItems: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Dict Items',
        notEmpty: true,
      },
      dictLocales: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Dict Locales',
        notEmpty: true,
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'DictKey',
        ebReadOnly: true,
        notEmpty: true,
      },
      atomRevision: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Revision',
        ebReadOnly: true,
      },
    },
  };
  // dict search
  schemas.dictSearch = {
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
