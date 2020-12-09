module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Post',
      atomStaticKey: 'createPost',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'post',
        atomAction: 'create',
      }),
      resourceRoles: 'template.cms-community-writer',
    },
    {
      atomName: 'Post List',
      atomStaticKey: 'listPost',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'post',
        atomAction: 'read',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
