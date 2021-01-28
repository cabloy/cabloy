export default {
  layout: {
    scene: {
      web: 'a-layoutmobile:layoutMobile',
    },
    default: {
      login: '/a/login/login',
      loginOnStart: true,
      toolbar: {
        meta: {
          tabbar: true, labels: true, bottom: true,
        },
        buttonActive: '',
        buttons: [],
      },
      size: {
        small: 320,
      },
    },
  },
};
