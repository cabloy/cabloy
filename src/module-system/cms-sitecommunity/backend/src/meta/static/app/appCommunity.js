const moduleInfo = module.info;

const info = {
  home: {
    mode: 'page',
    page: '/a/basefront/atom/list?module=cms-sitecommunity&atomClassName=post',
  },
};
const content = {
  info: {
    atomClass: {
      module: moduleInfo.relativeName,
      atomClassName: 'post',
    },
  },
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
  atomName: 'Community',
  atomStaticKey: 'appCommunity',
  atomRevision: 5,
  atomCategoryId: 'AppCategoryCMS',
  description: '',
  appIcon: ':outline:article-outline',
  appIsolate: false,
  appLanguage: true,
  appCms: true,
  content: JSON.stringify(content),
  resourceRoles: 'root',
  appSorting: 0,
};
module.exports = _app;
