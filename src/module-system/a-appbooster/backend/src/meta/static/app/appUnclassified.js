// const moduleInfo = module.info;

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
module.exports = _app;
