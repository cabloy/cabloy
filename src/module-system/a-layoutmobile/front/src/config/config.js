export default {
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    toolbar: {
      meta: {
        tabbar: true, labels: true, bottom: true,
      },
      buttonActive: 'a-layoutmobile:buttonAtom',
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonHome' },
        { module: 'a-layoutmobile', name: 'buttonAtom' },
        { module: 'a-layoutmobile', name: 'buttonMine' },
      ],
    },
    size: {
      small: 320,
    },
  },
};
