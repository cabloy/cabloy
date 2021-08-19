import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';

// container: {
//   options,
//   layout,
// },

export default {
  mixins: [Base, Page, Layout],
  data() {
    return {};
  },
  created() {
    this.index_init();
  },
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
  methods: {
    async index_init() {
      await this.base_init();
      await this.layout_prepareConfig();
      this.base.ready = true;
    },
  },
};
