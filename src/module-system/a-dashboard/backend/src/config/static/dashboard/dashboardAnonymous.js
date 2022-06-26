module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    root: {
      widgets: [],
    },
  };
  const dashboard = {
    atomName: 'Home',
    atomStaticKey: 'dashboardAnonymous',
    atomRevision: 10,
    description: 'Home(Anonymous)',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return dashboard;
};
