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
    return {};
  },
  created() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = this;
    if (this.layoutManager.container.atomClass && this.layoutManager.container.scene !== 'select' && this.layoutManager.container.scene !== 'selecting') {
      // eslint-disable-next-line
      this.layoutManager.subnavbar.enable = true;
    }
    this.layoutManager.data_layout({
      mode: 'continuous',
      autoInit: this.layoutManager.container.scene !== 'search',
    });
  },
  beforeDestroy() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
  },
  methods: {
    _renderLoadMore() {
      return <eb-load-more ref="loadMore" propsOnLoadClear={this.onLoadClear} propsOnLoadMore={this.onLoadMore} autoInit={this.layoutManager.container.scene !== 'search'}></eb-load-more>;
    },
  },
  render() {
    return (
      <div>
        {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
        {this.layoutManager.data_renderLoadMore()}
      </div>
    );
  },
};
