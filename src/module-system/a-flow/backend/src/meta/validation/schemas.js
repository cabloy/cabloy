module.exports = app => {
  const schemas = {};
  // flowDef
  schemas.flowDef = {
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
        ebTitle: 'Name',
        notEmpty: true,
      },
      // content
      __groupContent: {
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Content',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderFlowDefContent',
        },
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
      },
      atomTags: {
        type: ['string', 'null'],
        ebType: 'tags',
        ebTitle: 'Tags',
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
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
