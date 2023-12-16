// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    presets: {
      anonymous: {},
      authenticated: {},
    },
  };
  const _app = {
    atomName: 'Unclassified',
    atomStaticKey: 'appUnclassified',
    atomRevision: 1,
    atomCategoryId: 'AppCategoryManagement',
    description: '',
    appIcon: '::info-circle',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 1,
  };
  return _app;
};
