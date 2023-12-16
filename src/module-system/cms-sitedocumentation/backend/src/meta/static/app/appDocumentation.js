const moduleInfo = module.info;
module.exports = app => {
  const info = {
    home: {
      mode: 'page',
      page: '/a/basefront/atom/list?module=cms-sitedocumentation&atomClassName=document',
    },
  };
  const content = {
    info: {
      atomClass: {
        module: moduleInfo.relativeName,
        atomClassName: 'document',
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
    atomName: 'Documentation',
    atomStaticKey: 'appDocumentation',
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
