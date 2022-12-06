const __default = {
  login: '/a/login/login',
  loginOnStart: true,
  toolbar: {
    meta: {
      tabbar: true,
      labels: true,
      bottom: true,
    },
    buttonActive: '',
    buttons: [],
  },
  size: {
    small: 320,
  },
};
export default {
  layout: {
    default: {
      anonymous: __default,
      authenticated: __default,
    },
  },
};
