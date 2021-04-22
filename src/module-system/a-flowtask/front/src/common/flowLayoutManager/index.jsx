import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Subnavbar from './subnavbar.jsx';
import Info from './info.jsx';
import Timeline from './timeline.jsx';
import Actions from './actions.jsx';
import Notification from './notification.jsx';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;

// container: {
//   flowId,
//   flowTaskId,
//   layout,
// },

export default {
  mixins: [
    ebAtomActions,
    Base, Page, Layout, Subnavbar, Info, Timeline, Actions, Notification,
  ],
  data() {
    return {
    };
  },
  created() {
    this.base_loadData().then(res => {
      if (!res) return;
      this.layout_prepareConfig().then(() => {
        this.base.ready = true;
      });
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
