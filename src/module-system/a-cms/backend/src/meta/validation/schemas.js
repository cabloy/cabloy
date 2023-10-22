module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // article
  schemas.article = {
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
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      // content
      __groupContent: {
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'markdown-content-cms',
        ebTitle: 'Content',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomLanguage: {
        type: 'string',
        ebType: 'language',
        ebTitle: 'Language',
        notEmpty: true,
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
        notEmpty: true,
      },
      atomTags: {
        type: ['string', 'null'],
        ebType: 'tags',
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
        ebParams: {
          textarea: true,
        },
        ebTitle: 'Description',
      },
      imageCover: {
        type: 'string',
        ebType: 'image',
        ebTitle: 'ArticleCover',
      },
      // Extra
      __groupExtra: {
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      slug: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Slug',
        'x-slug': true,
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
      allowComment: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Comment',
        default: true,
      },
      flag: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flag',
      },
      extra: {
        type: 'string',
        ebType: 'text',
        ebParams: {
          textarea: true,
        },
        ebTitle: 'Extra Attributes',
      },
      // editMode: {
      //   type: 'number',
      //   // ebType: 'text',
      //   ebTitle: 'Edit Mode',
      //   notEmpty: true,
      // },
    },
  };

  // article search
  schemas.articleSearch = {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
        ebSearch: {
          tableAlias: 'q',
        },
      },
    },
  };

  return schemas;
};
