module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  if (!app.meta.isTest && !app.meta.isLocal) return [];
  const resources = [
    // menu
    {
      atomName: 'Create Party',
      atomStaticKey: 'createParty',
      atomRevision: 0,
      atomCategoryId: 'menu.create',
      resourceType: 'menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'party',
        action: 'create',
      }),
    },
    {
      atomName: 'Party List',
      atomStaticKey: 'listParty',
      atomRevision: 0,
      atomCategoryId: 'menu.list',
      resourceType: 'menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'party',
        action: 'read',
      }),
    },
    {
      atomName: 'Kitchen-sink',
      atomStaticKey: 'kitchenSink',
      atomRevision: 0,
      atomCategoryId: 'menu.demonstration',
      resourceType: 'menu',
      resourceConfig: JSON.stringify({
        actionModule: moduleInfo.relativeName,
        actionPath: 'kitchen-sink/index',
      }),
    },
    // dashboard widget
    {
      atomName: 'Fruit Sales',
      atomStaticKey: 'widgetSales',
      atomRevision: 0,
      atomCategoryId: 'dashboardWidget.demonstration',
      resourceType: 'dashboardWidget',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'widgetSales',
      }),
    },
    {
      atomName: 'Fruit Sales(Line Chart)',
      atomStaticKey: 'widgetSalesLine',
      atomRevision: 0,
      atomCategoryId: 'dashboardWidget.demonstration',
      resourceType: 'dashboardWidget',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'widgetSalesLine',
      }),
    },
    {
      atomName: 'Fruit Sales(Pie Chart)',
      atomStaticKey: 'widgetSalesPie',
      atomRevision: 0,
      atomCategoryId: 'dashboardWidget.demonstration',
      resourceType: 'dashboardWidget',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'widgetSalesPie',
      }),
    },
    {
      atomName: 'Snapshots',
      atomStaticKey: 'widgetSnapshot',
      atomRevision: 0,
      atomCategoryId: 'dashboardWidget.demonstration',
      resourceType: 'dashboardWidget',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'widgetSnapshot',
      }),
    },
  ];
  return resources;
};
