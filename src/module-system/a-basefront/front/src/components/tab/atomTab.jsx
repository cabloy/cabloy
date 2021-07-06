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
      this.layout.instance && this.layout.instance.onPageRefresh(force);
    },
    loadMore() {
      this.layout.instance && this.layout.instance.onPageInfinite();
    },
  },
  render() {
    return this.layout_renderLayout();
  },
};
