module.exports = app => {
  const moduleInfo = module.info;
  const resources = [
    // menu
    {
      atomName: 'Create Dashboard',
      atomStaticKey: 'createDashboard',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dashboard',
        atomAction: 'create',
      }),
      resourceIcon: '::dashboard',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Dashboards',
      atomStaticKey: 'listDashboard',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dashboard',
        atomAction: 'read',
      }),
      resourceIcon: '::dashboard',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    // dashboard widget
    {
      atomName: 'About',
      atomStaticKey: 'widgetAbout',
      atomRevision: -1,
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
