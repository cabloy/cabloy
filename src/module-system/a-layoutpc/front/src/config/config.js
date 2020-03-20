export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    sidebar: {
      top: {
        buttons: [
          { module: 'a-base', name: 'buttonDashboard' },
        ],
        buttonMine:
        { name: 'Mine', iconMaterial: 'person', url: '/a/user/user/mine', scene: 'sidebar', sceneOptions: { side: 'right', name: 'mine', title: 'Mine' } },
        buttonHome:
        { name: 'Home', iconMaterial: 'dashboard', url: '/a/dashboard/dashboard', scene: 'dashboard', sceneOptions: { name: 'home' } },
      },
      left: {
        opened: false,
        cover: true,
        panelWidth: 280,
        tabsWidth: 24,
        toolbarHeight: 24,
        panelActive: '',
        panels: [
          { module: 'a-base', name: 'panelMenu' },
          { module: 'a-base', name: 'panelAtom' },
          { module: 'a-base', name: 'panelSearch' },
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
          { module: 'a-base', name: 'sectionClock' },
          { module: 'a-base', name: 'sectionCopyright' },
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
