module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create FlowDefinition',
      atomStaticKey: 'createFlowDef',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
        atomAction: 'create',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'FlowDefinition List',
      atomStaticKey: 'listFlowDef',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
        atomAction: 'read',
      }),
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};
