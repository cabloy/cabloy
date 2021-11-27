module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Document',
      atomStaticKey: 'createDocument',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'document',
        atomAction: 'create',
      }),
      resourceRoles: 'template.cms-documentation-writer',
    },
    {
      atomName: 'Document List',
      atomStaticKey: 'listDocument',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'document',
        atomAction: 'read',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
