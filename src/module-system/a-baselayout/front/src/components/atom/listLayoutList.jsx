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
    if (this.layoutManager.atomClass && (this.layoutManager.scene !== 'select' && this.layoutManager.scene !== 'selecting')) {
      this.layoutManager.subnavbarActions = true;
      this.layoutManager.loadActionsBulk();
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
      const params = this.layoutManager.prepareSelectParams();
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
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderLoadMore() {
      return <eb-load-more ref="loadMore" propsOnLoadClear={this.onLoadClear} propsOnLoadMore={this.onLoadMore} autoInit={this.layoutManager.scene !== 'search'}></eb-load-more>;
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

