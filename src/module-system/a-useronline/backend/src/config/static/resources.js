module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create UserOnline',
      atomStaticKey: 'createUserOnline',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'userOnline',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'UserOnline List',
      atomStaticKey: 'listUserOnline',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'userOnline',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};
