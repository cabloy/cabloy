module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // post
  schemas.post = {
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
          module: 'a-cms',
          name: 'renderArticleContent',
        },
      },
      // Basic Info
      groupBasicInfo: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
        ebGroupWhole: true,
      },
      language: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Language',
        ebMultiple: false,
        ebOptionsBlankAuto: true,
        notEmpty: true,
        ebRender: {
          module: 'a-cms',
          name: 'renderArticleLanguage',
        },
      },
      categoryId: {
        type: 'number',
        ebType: 'component',
        ebTitle: 'Category',
        notEmpty: true,
        ebRender: {
          module: 'a-cms',
          name: 'renderArticleCategory',
        },
      },
      tags: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Tags',
        ebRender: {
          module: 'a-cms',
          name: 'renderArticleTags',
        },
      },
    },
  };
  // post search
  schemas.postSearch = {
    type: 'object',
    properties: {
      language: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Language',
        ebMultiple: false,
        ebOptionsBlankAuto: true,
        ebRender: {
          module: 'a-cms',
          name: 'renderArticleSearchLanguage',
          options: {
            props: {
              atomClass: {
                module: moduleInfo.relativeName,
                atomClassName: 'post',
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
          module: 'a-cms',
          name: 'renderArticleSearchCategory',
          options: {
            props: {
              atomClass: {
                module: moduleInfo.relativeName,
                atomClassName: 'post',
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
