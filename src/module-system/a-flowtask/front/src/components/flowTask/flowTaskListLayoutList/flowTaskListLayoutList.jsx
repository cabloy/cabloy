export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  created() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = this;
  },
  beforeDestroy() {
    if (this.layoutManager.layout.instance === this) {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = null;
    }
  },
  methods: {
    onPageRefresh(force) {
      this.$refs.loadMore.reload(force);
    },
    onPageInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onPageClear() {
      this.$refs.loadMore.clear();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    async onLoadMore({ index }) {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // index
      params.options.page = { index };
      // fetch
      const res = await this.$api.post('/a/flowtask/task/select', params);
      this.items = this.items.concat(res.list);
      return res;
    },
    getItems() {
      return this.items;
    },
    _renderLoadMore() {
      return (
        <eb-load-more
          ref="loadMore"
          propsOnLoadClear={this.onLoadClear}
          propsOnLoadMore={this.onLoadMore}
          autoInit
        ></eb-load-more>
      );
    },
  },
  render() {
    return (
      <div>
        {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
        {this._renderLoadMore()}
      </div>
    );
  },
};
