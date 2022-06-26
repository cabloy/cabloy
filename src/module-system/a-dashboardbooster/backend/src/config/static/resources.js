module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // widget
    {
      atomName: 'InfoBox',
      atomStaticKey: 'widgetInfoBox',
      atomRevision: 1,
      atomCategoryId: 'a-dashboard:widget.Template',
      resourceType: 'a-dashboard:widget',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'widgetInfoBox',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
