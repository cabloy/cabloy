module.exports = app => {
  const schemas = {};
  // flowDefinition
  schemas.flowDefinition = {
    type: 'object',
    meta: {
      custom: {
        // component: 'flowDefinitionItem',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      flowDefinitionKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Key',
        notEmpty: true,
      },
      version: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Version',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      dynamic: {
        type: 'boolean',
        ebType: 'Toggle',
        ebTitle: 'Dynamic',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };
  // flowDefinition search
  schemas.flowDefinitionSearch = {
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
