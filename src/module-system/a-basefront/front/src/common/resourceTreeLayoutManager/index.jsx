import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Actions from './actions.jsx';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;

// container: {
//   maxLevelAutoOpened,
//   resourceType,
//   home,
//   layout,
// },

export default {
  mixins: [ebAtomActions, Base, Page, Layout, Actions],
  data() {
    return {};
  },
  created() {
    this.index_load();
  },
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
  methods: {
    async index_load() {
      const res = await this.base_load();
      if (!res) return;
      await this.layout_prepareConfig();
      this.base.ready = true;
    },
  },
};
