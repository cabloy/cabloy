export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    header: {
      buttons: [
        { name: 'Home', iconMaterial: 'dashboard', url: '/a/base/menu/list', scene: 'tool', sceneOptions: { name: 'home' } },
        { name: 'Atom', iconMaterial: 'group_work', url: '/a/base/atom/list' },
      ],
      mine:
        { name: 'Mine', iconMaterial: 'person', url: '/a/user/user/mine' },
    },
    panel: {
      left: [
        { name: 'menu', url: '/a/base/menu/list' },
        { name: 'search' },
      ],
    },
    size: {
      small: 320,
      top: 60,
      spacing: 8,
    },
  },
};
