module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    root: {
      widgets: [
        { module: 'a-dashboard', name: 'widgetAbout' },
      ],
    },
  };
  const dashboard = {
    atomName: 'Default',
    atomStaticKey: 'default',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return dashboard;
};
