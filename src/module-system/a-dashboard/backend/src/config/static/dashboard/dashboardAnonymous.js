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
    atomName: 'Home',
    atomStaticKey: 'dashboardAnonymous',
    atomRevision: 1,
    description: 'Home(Anonymous)',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return dashboard;
};
