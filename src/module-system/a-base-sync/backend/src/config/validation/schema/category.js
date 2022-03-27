module.exports = app => {
  const schemas = {};
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
  return schemas;
};
