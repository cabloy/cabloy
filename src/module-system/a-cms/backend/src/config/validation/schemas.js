module.exports = app => {
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      language: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Language',
        notEmpty: true,
      },
      editMode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Edit Mode',
        notEmpty: true,
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Language',
        notEmpty: true,
      },
    },
  };

  // article search
  schemas.articleSearch = {
    type: 'object',
    properties: {

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
