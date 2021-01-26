export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    toolbar: {
      tabbar: true, labels: true, bottom: true,
      buttons: [
        { module: 'a-layoutmobile', name: 'tabHome', active: true },
        { module: 'a-layoutmobile', name: 'tabAtom' },
        { module: 'a-layoutmobile', name: 'tabMine' },
      ],
    },
    size: {
      small: 320,
    },
  },
};
