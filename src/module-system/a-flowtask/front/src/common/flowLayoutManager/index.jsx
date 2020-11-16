import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Subnavbar from './subnavbar.jsx';
import Info from './info.jsx';

// container: {
//   flowId,
//   flowTaskId,
//   layout,
// },

export default {
  mixins: [ Base, Page, Layout, Subnavbar, Info ],
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
