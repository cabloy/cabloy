// const moduleInfo = module.info;
const info = {
  menu: {},
  home: {},
  mine: {},
};
const content = {
  presets: {
    anonymous: {
      mobile: info,
      pc: info,
    },
    authenticated: {
      mobile: info,
      pc: info,
    },
  },
};
const _app = {
  atomName: '<%=argv.appNameCapitalize%>',
  atomStaticKey: '<%=argv.appKey%>',
  atomRevision: 0,
  atomCategoryId: 'AppCategoryManagement',
  description: '',
  appIcon: '::radio-button-unchecked',
  appIsolate: false,
  content: JSON.stringify(content),
  resourceRoles: 'authenticated',
  appSorting: 0,
};
module.exports = _app;
