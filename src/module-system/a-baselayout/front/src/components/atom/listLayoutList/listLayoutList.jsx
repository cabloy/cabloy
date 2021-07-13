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
    this.layoutManager.layout.instance = this;
    if (this.layoutManager.container.atomClass && this.layoutManager.container.scene !== 'select' && this.layoutManager.container.scene !== 'selecting') {
      this.layoutManager.subnavbar.enable = true;
    }
  },
  beforeDestroy() {
    this.layoutManager.layout.instance = null;
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
      this.layoutManager.bulk.selectedAtoms = [];
      done();
    },
    async onLoadMore({ index }) {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // index
      params.options.page = { index };
      // fetch
      const res = await this.$api.post('/a/base/atom/select', params);
      this.items = this.items.concat(res.list);
      return res;
    },
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this.layoutManager,
          layout: this,
          blockConfig,
        },
      };
    },
    getItems() {
      return this.items;
    },
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderLoadMore() {
      return <eb-load-more ref="loadMore" propsOnLoadClear={this.onLoadClear} propsOnLoadMore={this.onLoadMore} autoInit={this.layoutManager.container.scene !== 'search'}></eb-load-more>;
    },
  },
  render() {
    return (
      <div>
        {this._renderBlock({ blockName: 'items' })}
        {this._renderLoadMore()}
      </div>
    );
  },
};
