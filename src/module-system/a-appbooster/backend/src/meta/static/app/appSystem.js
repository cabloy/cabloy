// const moduleInfo = module.info;

const content = {
  presets: {
    anonymous: {},
    authenticated: {
      mobile: {
        menu: {
          layout: 'a-appbooster:layoutAppMenuSystem',
        },
      },
      pc: {
        menu: {
          layout: 'a-appbooster:layoutAppMenuSystem',
        },
      },
    },
  },
};
const _app = {
  atomName: 'System',
  atomStaticKey: 'appSystem',
  atomRevision: 2,
  atomCategoryId: 'AppCategorySettings',
  description: '',
  appIcon: '::menu',
  appIsolate: false,
  content: JSON.stringify(content),
  resourceRoles: 'template.system',
  appSorting: 0,
};
module.exports = _app;
