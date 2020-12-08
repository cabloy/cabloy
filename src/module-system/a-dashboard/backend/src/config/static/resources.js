module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Dashboard',
      atomStaticKey: 'createDashboard',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dashboard',
        atomAction: 'create',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Dashboard List',
      atomStaticKey: 'listDashboard',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dashboard',
        atomAction: 'read',
      }),
      resourceRoles: 'template.system',
    },
    // dashboard widget
    {
      atomName: 'About',
      atomStaticKey: 'widgetAbout',
      atomRevision: 0,
      atomCategoryId: 'a-dashboard:widget.General',
      resourceType: 'a-dashboard:widget',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'widgetAbout',
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
