import listLayoutManager from '../../common/listLayoutManager/index.jsx';
export default {
  meta: {
    global: false,
  },
  mixins: [listLayoutManager],
  props: {
    container: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    reload(force) {
      this.data_onPageRefresh(force);
    },
    loadMore() {
      this.data_onPageInfinite();
    },
  },
  render() {
    return this.layout_renderLayout();
  },
};
