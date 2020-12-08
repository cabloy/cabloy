module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Article',
      atomStaticKey: 'createArticle',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'create',
      }),
      resourceRoles: 'template.cms-writer',
    },
    {
      atomName: 'Article List',
      atomStaticKey: 'listArticle',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'read',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
