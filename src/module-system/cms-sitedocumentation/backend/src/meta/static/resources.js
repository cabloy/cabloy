module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Document',
      atomStaticKey: 'createDocument',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'document',
        atomAction: 'create',
      }),
      resourceIcon: '::add',
      appKey: 'cms-sitedocumentation:appDocumentation',
      resourceRoles: 'template.cms-documentation-writer',
    },
    {
      atomName: 'Document List',
      atomStaticKey: 'listDocument',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.General',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'document',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:data-list-outline',
      appKey: 'cms-sitedocumentation:appDocumentation',
      resourceRoles: 'root',
    },
  ];
  return resources;
};
