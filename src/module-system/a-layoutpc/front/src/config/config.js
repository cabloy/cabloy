export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    autoHideSidebarOnOpenUrl: true,
    header: {
      button: {
        home: { name: 'Home', iconMaterial: 'dashboard', url: '/a/dashboard/dashboard', scene: 'dashboard', sceneOptions: { name: 'home' } },
        mine: { name: 'Mine', iconMaterial: 'person', url: '/a/user/user/mine', scene: 'sidebar', sceneOptions: { side: 'right', name: 'mine', title: 'Mine' } },
      },
    },
    sidebar: {
      top: {
        buttons: [
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
        sections: [
          { module: 'a-layoutpc', name: 'sectionClock' },
          { module: 'a-layoutpc', name: 'sectionCopyright' },
        ],
      },
    },
    size: {
      small: 320,
      top: 60,
      spacing: 8,
    },
  },
};
