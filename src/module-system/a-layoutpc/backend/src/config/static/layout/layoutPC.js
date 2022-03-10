module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    sidebar: {
      top: {
        buttons: [
          { module: 'a-layoutpc', name: 'buttonHome' },
          { module: 'a-layoutpc', name: 'buttonDashboard' },
          { module: 'a-layoutpc', name: 'buttonFullscreen' },
          { module: 'a-layoutpc', name: 'buttonMine' },
        ],
      },
      left: {
        panels: [
          { module: 'a-layoutpc', name: 'panelMenu' },
          { module: 'a-layoutpc', name: 'panelAtom' },
          { module: 'a-layoutpc', name: 'panelSearch' },
        ],
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
    atomRevision: 3,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
