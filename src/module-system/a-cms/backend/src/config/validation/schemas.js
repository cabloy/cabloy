module.exports = app => {
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    meta: {
      custom: {
        component: 'articleItem',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebMultiple: false,
        notEmpty: true,
      },
      categoryId: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Category',
        notEmpty: true,
      },
      sticky: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Sticky',
        default: false,
      },
      keywords: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Keywords',
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Description',
      },
      editMode: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Edit Mode',
        notEmpty: true,
      },
      slug: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Slug',
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      flag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      extra: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Extra Attributes',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };

  // article search
  schemas.articleSearch = {
    type: 'object',
    meta: {
      custom: {
        component: 'articleSearch',
      },
    },
    properties: {
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebMultiple: false,
      },
      categoryId: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Category',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
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
        ebTitle: 'Category name',
        notEmpty: true,
      },
      hidden: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Hidden',
        default: false,
      },
      sorting: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Sorting',
      },
      flag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      catalog: {
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
        notEmpty: true,
      },
    },
  };

  return schemas;
};
