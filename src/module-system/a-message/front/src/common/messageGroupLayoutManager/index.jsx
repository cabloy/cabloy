import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';

// container: {
// },

export default {
  mixins: [
    Base, Page, Layout,
  ],
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
