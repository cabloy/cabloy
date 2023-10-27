module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const article = {
    info: {
      bean: 'article',
      title: 'Article',
      tableName: '',
      tableNameModes: {
        default: '',
        full: '',
        search: '',
      },
      language: true,
      category: true,
      tag: true,
      cms: true,
      fields: {
        dicts: {
          atomState: {
            draft: {
              dictKey: 'default',
            },
          },
        },
      },
    },
    actions: {
      preview: {
        code: 101,
        title: 'Preview',
        actionModule: moduleInfo.relativeName,
        actionComponent: 'action',
        icon: { f7: '::preview' },
        enableOnStatic: null,
        enableOnOpened: null,
        stage: 'draft,formal',
      },
    },
    validator: 'article',
    search: {
      validator: 'articleSearch',
    },
  };
  return article;
};
