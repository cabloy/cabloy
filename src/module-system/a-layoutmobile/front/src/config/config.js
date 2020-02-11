export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    toolbar: {
      tabbar: true, labels: true, bottom: true,
    },
    tabs: [
      { name: 'Home', tabLinkActive: true, iconMaterial: 'home', url: '/a/base/menu/list' },
      { name: 'Atom', tabLinkActive: false, iconMaterial: 'group_work', url: '/a/base/atom/list' },
      { name: 'Mine', tabLinkActive: false, iconMaterial: 'person', url: '/a/user/user/mine' },
    ],
    size: {
      small: 320,
    },
  },
};
