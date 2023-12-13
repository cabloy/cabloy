module.exports = app => {
  const moduleInfo = module.info;
  const info = {
    home: {
      mode: 'page',
      page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
    },
  };
  const content = {
    info: {
      atomClass: {
        module: moduleInfo.relativeName,
        atomClassName: 'article',
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
    atomName: 'CMS',
    atomStaticKey: 'appCms',
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
  return _app;
};
