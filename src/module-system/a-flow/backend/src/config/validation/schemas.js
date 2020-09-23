module.exports = app => {
  const schemas = {};
  // flowDef
  schemas.flowDef = {
    type: 'object',
    meta: {
      custom: {
        // component: 'flowDefItem',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      flowDefKey: {
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
  // flowDef search
  schemas.flowDefSearch = {
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
