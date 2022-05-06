import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Actions from './actions.jsx';
import Validate from './validate.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;
const ebDetailClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailClasses;
const ebDetailActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailActions;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;

// container: {
//   mode,  // edit/view
//   flowTaskId,
//   detailId,
//   detailItemId,
//   layout,
// },

export default {
  mixins: [
    ebLayoutManagerBase, //
    ebDetailClasses,
    ebDetailActions,
    ebPageDirty,
    Base,
    Page,
    Layout,
    Actions,
    Validate,
  ],
  data() {
    return {};
  },
  created() {
    this.index_load();
  },
  methods: {
    async index_load() {
      await this.base_init();
      const res = await this.base_loadItem();
      if (!res) return;
      await this.layout_prepareConfigLayout();
      this.base.ready = true;
    },
  },
};
