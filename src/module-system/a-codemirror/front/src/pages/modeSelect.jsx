import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

export default {
  mixins: [ebPageContext],
  data() {
    return {
      modes: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-codemirror');
      this.modes = layoutConfig.modes || [];
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Select Code Mode')} eb-back-link="Back"></eb-navbar>
      </eb-page>
    );
  },
};
