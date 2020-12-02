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
        ebType: 'component',
        ebTitle: 'Content',
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleContent',
        },
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
        ebType: 'component',
        ebTitle: 'Tags',
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleTags',
        },
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
    properties: {
      language: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Language',
        ebMultiple: false,
        ebOptionsBlankAuto: true,
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleSearchLanguage',
          options: {
            props: {
              atomClass: {
                module: moduleInfo.relativeName,
                atomClassName: 'article',
              },
            },
          },
        },
      },
      categoryId: {
        type: 'number',
        ebType: 'component',
        ebTitle: 'Category',
        ebRender: {
          module: moduleInfo.relativeName,
          name: 'renderArticleSearchCategory',
          options: {
            props: {
              atomClass: {
                module: moduleInfo.relativeName,
                atomClassName: 'article',
              },
            },
          },
        },
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };

  return schemas;
};
