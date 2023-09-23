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
      dict: {
        states: {
          draft: {
            dictKey: null,
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
        enableOnStatic: true,
        enableOnOpened: true,
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
