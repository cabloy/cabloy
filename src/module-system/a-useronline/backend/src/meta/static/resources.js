const moduleInfo = module.info;
module.exports = app => {
  const resources = [
    // menu
    // {
    //   atomName: 'Create UserOnline',
    //   atomStaticKey: 'createUserOnline',
    //   atomRevision: 0,
    //   atomCategoryId: 'a-base:menu.Create',
    //   resourceType: 'a-base:menu',
    //   resourceConfig: JSON.stringify({
    //     module: moduleInfo.relativeName,
    //     atomClassName: 'userOnline',
    //     atomAction: 'create',
    //   }),
    //   resourceRoles: 'authenticated',
    // },
    {
      atomName: 'Users Status',
      atomStaticKey: 'listUserStatus',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.RuntimeData',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'userOnline',
        atomAction: 'read',
      }),
      resourceIcon: '::people',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 1,
    },
    {
      atomName: 'LoginLog',
      atomStaticKey: 'listLoginLog',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.RuntimeData',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'userOnlineHistory',
        atomAction: 'read',
      }),
      resourceIcon: ':role:shield-key',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 2,
    },
    // {
    //   atomName: 'Online Users(History)',
    //   atomStaticKey: 'listUserOnlineHistory',
    //   atomRevision: 0,
    //   atomCategoryId: 'a-base:menu.List',
    //   resourceType: 'a-base:menu',
    //   resourceConfig: JSON.stringify({
    //     module: moduleInfo.relativeName,
    //     atomClassName: 'userOnlineHistory',
    //     atomAction: 'read',
    //   }),
    //   resourceRoles: 'template.system',
    // },
  ];
  return resources;
};
