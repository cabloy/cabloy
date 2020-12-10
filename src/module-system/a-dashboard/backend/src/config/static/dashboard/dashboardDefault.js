module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    root: {
      widgets: [
        {
          module: 'a-dashboard',
          name: 'widgetAbout',
        },
      ],
    },
  };
  const dashboard = {
    atomName: 'Default',
    atomStaticKey: 'dashboardDefault',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return dashboard;
};
