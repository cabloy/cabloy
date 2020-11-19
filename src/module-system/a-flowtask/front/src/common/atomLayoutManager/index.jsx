import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Info from './info.jsx';

// container: {
//   flowTaskId,
//   mode, // edit/view
//   layout,
// },

export default {
  mixins: [ Base, Page, Layout, Info ],
  data() {
    return {
    };
  },
  created() {
    this.layout_prepareConfig().then(() => {
      this.base.ready = true;
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
