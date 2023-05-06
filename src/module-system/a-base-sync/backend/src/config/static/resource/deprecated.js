module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Resource',
      atomStaticKey: 'createResource',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'resource',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:software-resource-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Comment List',
      atomStaticKey: 'listComment',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.Tools',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/basefront/comment/all',
      }),
      resourceIcon: '::comment-dots',
      appKey: 'a-appbooster:appGeneral',
      resourceRoles: 'root',
    },
  ];
  return resources;
};
