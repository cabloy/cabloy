export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    toolbar: {
      meta: {
        tabbar: true, labels: true, bottom: true,
      },
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonHome', active: true },
        { module: 'a-layoutmobile', name: 'buttonAtom' },
        { module: 'a-layoutmobile', name: 'buttonMine' },
      ],
    },
    size: {
      small: 320,
    },
  },
};
