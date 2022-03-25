import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
export default {
  meta: {
    global: false,
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {};
  },
  methods: {
    async disable() {
      const ctx = this.ctx;
      // in dingtalk
      if (!ctx.$device.dingtalk) return true;
      // associate
      if (this.state === 'associate') return false;
      // reload
      const reload = ctx.$store.state.auth.reload;
      if (reload) return false;
      // login direct for state=login
      try {
        await this.login();
      } catch (err) {
        ctx.$view.toast.show({ text: err.message });
        return false;
      }
      // throw error on success
      throw new Error();
    },
    async login(/* { hash }*/) {
      const ctx = this.ctx;
      // jssdk config
      const action = {
        actionModule: 'a-dingtalk',
        actionComponent: 'jssdk',
        name: 'config',
      };
      const res = await ctx.$meta.util.performAction({ ctx, action });
      const dd = res.dd;
      const config = res.config;
      // requestAuthCode
      return new Promise((resolve, reject) => {
        dd.runtime.permission.requestAuthCode({
          corpId: config.corpId,
          onSuccess: info => {
            const code = info.code;
            this._authLogin({ code }).then(resolve).catch(reject);
          },
          onFail: err => {
            reject(new Error(err.errorMessage || err.message));
          },
        });
      });
    },
    async _authLogin({ code }) {
      const ctx = this.ctx;
      await ctx.$api.post('/a/dingtalk/auth/login', { providerScene: this.providerScene, code, state: this.state });
      ctx.$meta.vueApp.reload({ echo: true });
    },
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
