import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      return false;
    },
    login({ ctx, url, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url, state, hash });
    },
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      const url = this.combineLoginUrl();
      this.$options.meta.login({ ctx: this, url });
    },
  },
  render() {
    const imgSrc = require('../assets/img/github.png');
    return (
      <eb-button tooltip={this.provider.meta.titleLocale} propsOnPerform={this.onPerformSignIn}>
        <img src={imgSrc} />
      </eb-button>
    );
  },
};
