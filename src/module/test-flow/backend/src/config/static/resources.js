module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Purchase Order',
      atomStaticKey: 'createPurchaseOrder',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'purchaseOrder',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'Purchase Order List',
      atomStaticKey: 'listPurchaseOrder',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'purchaseOrder',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};
