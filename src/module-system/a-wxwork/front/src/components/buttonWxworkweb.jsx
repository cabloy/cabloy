import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
const urlLogin = '/api/a/wxwork/passport/a-wxwork/wxworkweb';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // only pc
      if (ctx.$device.iphone || ctx.$device.android || ctx.$device.wxwork || ctx.$device.wechat) {
        return true;
      }
      return false;
    },
    login({ ctx, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
    },
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      return this.login();
    },
  },
  render() {
    const imgSrc = require('../assets/img/wxwork-48.png');
    return (
      <eb-button tooltip={this.provider.meta.titleLocale} propsOnPerform={this.onPerformSignIn}>
        <img src={imgSrc} />
      </eb-button>
    );
  },
};
