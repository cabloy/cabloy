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
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Key2',
        // notEmpty: true,
      },
      // atomRevision: {
      //   type: 'string',
      //   ebType: 'text',
      //   ebTitle: 'Revision',
      //   notEmpty: true,
      // },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
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
