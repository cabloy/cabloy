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
  },
  methods: {
    onPageRefresh() {
      this.$refs.loadMore.reload();
    },
    onPageInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore() {
      // params
      const params = this.layoutManager.prepareSelectParams();
      // fetch
      return this.$api.post('/a/base/atom/select', params).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });

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
      return <eb-load-more ref="loadMore" propsOnLoadClear={this.onLoadClear} propsOnLoadMore={this.onLoadMore} autoInit={true}></eb-load-more>;
    },
  },
  render() {
    return (
      <div>
        {this._renderBlock({ blockName: 'title' })}
        {this._renderBlock({ blockName: 'items' })}
        {this._renderLoadMore()}
      </div>
    );
  },
};

