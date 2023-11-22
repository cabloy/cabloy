module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const dict = {
    info: {
      bean: 'dict',
      title: 'Dict',
      tableName: 'aDict',
      tableNameModes: {
        full: 'aDictViewFull',
        search: 'aDict', // out of memory for aDictViewFull sort
      },
      inner: true,
      resource: true,
      language: false,
      category: false,
      tag: false,
      comment: false,
      attachment: false,
      fields: {
        dicts: {
          dictMode: {
            dictKey: 'a-dictbooster:dictMode',
            translate: false,
          },
        },
      },
      layout: {
        config: {
          atomList: 'layoutAtomListDict',
        },
      },
    },
    actions: {
      write: {
        enableOnStatic: null,
      },
    },
    validator: 'dict',
    search: {
      validator: 'dictSearch',
    },
  };
  return dict;
};
