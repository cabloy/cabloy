module.exports = app => {
  const schemas = {};
  // appMenu
  schemas.appMenu = {
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
      appMenuConfig: {
        type: ['string', 'null'],
        ebType: 'json',
        ebTitle: 'Config',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      appKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'App Key',
        notEmpty: true,
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      appMenuSorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
        ebReadOnly: true,
        notEmpty: true,
      },
    },
  };
  // appMenu search
  schemas.appMenuSearch = {
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
