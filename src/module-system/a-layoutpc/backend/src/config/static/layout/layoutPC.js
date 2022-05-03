module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    sidebar: {
      top: {
        buttons: [
          { module: 'a-layoutpc', name: 'buttonAppHome' },
          { module: 'a-layoutpc', name: 'buttonSearch' },
          { module: 'a-layoutpc', name: 'buttonFullscreen' },
          { module: 'a-layoutpc', name: 'buttonMine' },
        ],
      },
      left: {
        panels: [],
      },
      right: {
        panels: [],
      },
      bottom: {
        panels: [],
        buttons: [
          { module: 'a-layoutpc', name: 'buttonViewLayout' },
          { module: 'a-layoutpc', name: 'buttonTheme' },
          { module: 'a-layoutpc', name: 'buttonClock' },
          { module: 'a-layoutpc', name: 'buttonCopyright' },
        ],
      },
    },
  };
  const layout = {
    atomName: 'PC Layout(Authenticated)',
    atomStaticKey: 'layoutPC',
    atomRevision: 4,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
