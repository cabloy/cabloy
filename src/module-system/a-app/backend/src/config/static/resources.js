module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create App',
      atomStaticKey: 'createApp',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'app',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'App List',
      atomStaticKey: 'listApp',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'app',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'Create AppMenu',
      atomStaticKey: 'createAppMenu',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'appMenu',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'AppMenu List',
      atomStaticKey: 'listAppMenu',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'appMenu',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};
