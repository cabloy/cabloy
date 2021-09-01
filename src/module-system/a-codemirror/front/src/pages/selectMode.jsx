import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Select Code Mode')} eb-back-link="Back"></eb-navbar>
      </eb-page>
    );
  },
};
