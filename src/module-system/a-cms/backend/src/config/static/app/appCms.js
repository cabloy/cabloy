module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          home: {
            mode: 'page',
            page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
          },
        },
        pc: {
          home: {
            mode: 'page',
            page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
          },
        },
      },
      authenticated: {
        mobile: {
          home: {
            mode: 'page',
            page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
          },
        },
        pc: {
          home: {
            mode: 'page',
            page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'CMS',
    atomStaticKey: 'appCms',
    atomRevision: 1,
    atomCategoryId: 'General',
    description: '',
    appIcon: ':outline:article-outline',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};
