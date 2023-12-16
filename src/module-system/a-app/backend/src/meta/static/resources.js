const moduleInfo = module.info;
module.exports = app => {
  const resources = [
    // menu
    {
      atomName: 'Create App',
      atomStaticKey: 'createApp',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'app',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:apps-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Apps',
      atomStaticKey: 'listApp',
      atomRevision: 3,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'app',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:apps-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};
