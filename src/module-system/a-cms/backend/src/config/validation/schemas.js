module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    properties: {
      atomId: {
        type: 'number',
      },
      // title
      groupTitle: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      // content
      groupContent: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
      // Basic Info
      groupBasicInfo: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      language: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Language',
        ebMultiple: false,
        ebOptionsBlankAuto: true,
        notEmpty: true,
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleLanguage',
        },
      },
      categoryId: {
        type: 'number',
        ebType: 'component',
        ebTitle: 'Category',
        notEmpty: true,
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleCategory',
        },
      },
      tags: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Tags',
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
      slug: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Slug',
        'x-slug': true,
      },
      allowComment: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Comment',
        default: false,
      },
      // Extra
      groupExtra: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      sticky: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Sticky',
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
      extra: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Extra Attributes',
      },
      editMode: {
        type: 'number',
        // ebType: 'text',
        ebTitle: 'Edit Mode',
        notEmpty: true,
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
        ebOptionsBlankAuto: true,
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
        ebTitle: 'Category Name',
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
      url: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Url',
      },
    },
  };

  return schemas;
};
