module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const appMenus = [
    {
      atomName: 'Comment List',
      atomStaticKey: 'listComment',
      atomRevision: 1,
      atomCategoryId: 0,
      appKey: 'a-appbooster:appTools',
      appMenuConfig: JSON.stringify({
        actionPath: '/a/basefront/comment/all',
      }),
      resourceRoles: 'root',
      appMenuSorting: 1,
    },
    {
      atomName: 'Developer Tool',
      atomStaticKey: 'developerTool',
      atomRevision: 3,
      atomCategoryId: 0,
      appKey: 'a-appbooster:appTools',
      appMenuConfig: JSON.stringify({
        actionModule: 'a-basefront',
        actionComponent: 'developerTool',
        name: 'initialize',
      }),
      resourceRoles: 'template.system',
      appMenuSorting: 2,
    },
  ];
  // ok
  return appMenus;
};
