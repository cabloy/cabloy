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
      return false;
    },
    onPerformSignIn() {
      this.login();
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
