module.exports = app => {
  const schemas = {};
  // app
  schemas.app = {
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
      content: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Content',
        notEmpty: true,
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
      },
      appIcon: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Icon',
        notEmpty: true,
      },
      appIsolate: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'AppIsolateTitle',
      },
      appLanguage: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'AppLanguageTitle',
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      appSorting: {
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
  // app search
  schemas.appSearch = {
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
