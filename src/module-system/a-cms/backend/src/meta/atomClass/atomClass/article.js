const moduleInfo = module.info;
module.exports = {
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
    flow: {
      stage: 'draft',
    },
    fields: {
      dicts: {
        atomState: {
          draft: {
            dictKey: null,
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
