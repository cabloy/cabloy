module.exports = app => {
  const schemas = {};
  // user
  schemas.user = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
        'x-exists': true,
        ebReadOnly: true,
      },
      realName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Realname',
        notEmpty: true,
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        // notEmpty: true,
        // format: 'email',
        'x-exists': true,
        ebReadOnly: true,
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        // notEmpty: true,
        'x-exists': true,
        ebReadOnly: true,
      },
      motto: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Motto',
      },
      locale: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Locale',
        ebOptionsUrl: '/a/base/base/locales',
        ebReadOnly: true,
      },
    },
  };

  // category
  schemas.category = {
    type: 'object',
    properties: {
      categoryName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Category Name',
        notEmpty: true,
      },
      categoryHidden: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Hidden',
        default: false,
      },
      categorySorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      categoryFlag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      categoryCatalog: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Catalog',
        ebReadOnly: true,
        default: false,
      },
      language: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Language',
        ebReadOnly: true,
        // notEmpty: true,
      },
      categoryUrl: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Url',
      },
    },
  };

  // resource
  schemas.resource = {
    type: 'object',
    properties: {
      // title
      groupTitle: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      // config
      groupConfig: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Config',
      },
      resourceConfig: {
        type: [ 'string', 'null' ],
        ebType: 'json',
        ebTitle: 'Config',
      },
      // Basic Info
      groupBasicInfo: {
        type: 'null',
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
        type: [ 'string', 'null' ],
        ebType: 'tags',
        ebTitle: 'Tags',
      },
      // Extra
      groupExtra: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      resourceType: {
        type: 'string',
        ebType: 'resourceType',
        ebTitle: 'Resource Type',
        ebOptionsBlankAuto: true,
        notEmpty: true,
      },
      resourceSorting: {
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

  // resource search
  schemas.resourceSearch = {
    type: 'object',
    properties: {
    },
  };

  return schemas;
};
