import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
const urlLogin = '/api/a/auth/passport/a-wxwork/wxwork';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // in wxwork
      if (!ctx.$device.wxwork) return true;
      // associate
      if (state === 'associate') return false;
      // reload
      const reload = ctx.$store.state.auth.reload;
      if (reload) return false;
      // login direct for state=login
      this.login({ ctx, state });
      // throw error
      throw new Error();
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
