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
      // only pc
      if (ctx.$device.iphone || ctx.$device.android || ctx.$device.dingtalk) {
        return true;
      }
      return false;
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
