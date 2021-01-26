module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    login: '/a/login/login',
    loginOnStart: true,
    autoHideSidebarOnOpenUrl: true,
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
        opened: false,
        cover: true,
        panelWidth: 280,
        tabsWidth: 24,
        toolbarHeight: 24,
        panelActive: '',
        panels: [
          { module: 'a-layoutpc', name: 'panelMenu' },
          { module: 'a-layoutpc', name: 'panelAtom' },
          { module: 'a-layoutpc', name: 'panelSearch' },
        ],
      },
      right: {
        opened: false,
        cover: true,
        panelWidth: 280,
        tabsWidth: 24,
        toolbarHeight: 24,
        panelActive: '',
        panels: [],
      },
      bottom: {
        opened: false,
        cover: true,
        panelHeight: 280,
        tabsHeight: 24,
        toolbarHeight: 24,
        panelActive: '',
        panels: [],
        buttons: [
          { module: 'a-layoutpc', name: 'buttonClock' },
          { module: 'a-layoutpc', name: 'buttonCopyright' },
        ],
      },
    },
    size: {
      small: 320,
      top: 60,
      spacing: 8,
    },
  };
  const layout = {
    atomName: 'PC Layout',
    atomStaticKey: 'layoutPC',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
