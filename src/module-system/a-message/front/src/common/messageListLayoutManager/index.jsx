import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Notification from './notification.jsx';

// container: {
//   messageClass,
// },

export default {
  mixins: [Base, Page, Layout, Notification],
  data() {
    return {};
  },
  created() {
    this.layout_prepareConfig().then(() => {
      this.base.ready = true;
    });
  },
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
};
