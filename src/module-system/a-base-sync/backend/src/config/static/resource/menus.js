module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    {
      atomName: 'GeneralResources',
      atomStaticKey: 'listResource',
      atomRevision: 3,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'resource',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:software-resource-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },

    {
      atomName: 'Developer Tool',
      atomStaticKey: 'developerTool',
      atomRevision: 4,
      atomCategoryId: 'a-base:menu.Tools',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionModule: 'a-basefront',
        actionComponent: 'developerTool',
        name: 'initialize',
      }),
      resourceIcon: '::developer-board',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};
