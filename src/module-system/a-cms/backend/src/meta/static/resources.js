module.exports = app => {
  const moduleInfo = module.info;
  const resources = [
    // menu
    {
      atomName: 'Create Article',
      atomStaticKey: 'createArticle',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'create',
      }),
      resourceIcon: '::add',
      appKey: 'a-cms:appCms',
      resourceRoles: 'template.cms-writer',
    },
    {
      atomName: 'Article List',
      atomStaticKey: 'listArticle',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'article',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:data-list-outline',
      appKey: 'a-cms:appCms',
      resourceRoles: 'root',
    },
  ];
  return resources;
};
