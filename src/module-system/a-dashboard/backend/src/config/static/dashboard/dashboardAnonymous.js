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
    atomName: 'Anonymous',
    atomStaticKey: 'dashboardAnonymous',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return dashboard;
};
