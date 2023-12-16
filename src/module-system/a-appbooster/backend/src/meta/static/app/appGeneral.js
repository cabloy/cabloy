// const moduleInfo = module.info;
module.exports = app => {
  const info = {
    mine: {
      layout: true,
    },
  };
  const content = {
    presets: {
      anonymous: {},
      authenticated: {
        mobile: info,
        pc: info,
      },
    },
  };
  const _app = {
    atomName: 'General',
    atomStaticKey: 'appGeneral',
    atomRevision: 9,
    atomCategoryId: 'AppCategoryManagement',
    description: '',
    appIcon: '::radio-button-unchecked',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};
