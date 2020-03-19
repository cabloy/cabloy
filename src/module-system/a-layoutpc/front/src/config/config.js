export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    header: {
      buttons: [
        { name: 'Home', iconMaterial: 'dashboard', url: '/a/dashboard/dashboard', scene: 'dashboard', sceneOptions: { name: 'home' } },
      ],
      mine:
        { name: 'Mine', iconMaterial: 'person', url: '/a/user/user/mine', scene: 'sidebar', sceneOptions: { side: 'right', name: 'mine', title: 'Mine' } },
    },
    sidebar: {
      left: {
        panels: [
          { module: 'a-base', name: 'panelMenu' },
          { module: 'a-base', name: 'panelAtom' },
          { module: 'a-base', name: 'panelSearch' },
        ],
      },
      right: {
        panels: [],
      },
      bottom: {
        sections: [
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
