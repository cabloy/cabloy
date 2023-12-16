const moduleInfo = module.info;

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
module.exports = resources;
