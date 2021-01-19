import flowListLayoutManager from '../../common/flowListLayoutManager/index.jsx';
export default {
  meta: {
    global: false,
  },
  mixins: [ flowListLayoutManager ],
  props: {
    container: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
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
