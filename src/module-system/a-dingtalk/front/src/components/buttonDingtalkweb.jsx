const urlLogin = '/api/a/dingtalk/passport/a-dingtalk/dingtalkweb';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // only pc
      if (ctx.$device.iphone || ctx.$device.android || ctx.$device.dingtalk) {
        return true;
      }
      return false;
    },
    login({ ctx, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      return this.login();
    },
  },
  render() {
    const imgSrc = require('../assets/img/dingtalk-40.png');
    return (
      <eb-button tooltip={this.provider.meta.titleLocale} propsOnPerform={this.onPerformSignIn}>
        <img src={imgSrc} />
      </eb-button>
    );
  },
};
