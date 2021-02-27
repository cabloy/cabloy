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
    // queueScroll
    this._queueScroll = this.$meta.util.queue(this._queueTaskScroll.bind(this));
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
      const res = await this.$api.post('/a/socketio/message/select', params);
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
    messageReadSet({ message }) {
      const item = this.items.find(item => item.id === message.id);
      if (item) {
        item.messageRead = 1;
      }
    },
    messageReadAll() {
      for (const item of this.items) {
        if (item.messageRead === 0) {
          item.messageRead = 1;
        }
      }
    },
    messageAppendNew({ message }) {
      this.items.unshift(message);
      this._scroll();
    },
    _scroll() {
      this.$nextTick(() => {
        this._queueScroll.push();
      });
    },
    _queueTaskScroll(none, cb) {
      const pageContent = this.$$(this.$page.$el).find('.page-content');
      if (pageContent.scrollTop() === 0) return cb();
      pageContent.scrollTop(0, 300, cb);
    },
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderLoadMore() {
      return <eb-load-more ref="loadMore" propsOnLoadClear={this.onLoadClear} propsOnLoadMore={this.onLoadMore} autoInit></eb-load-more>;
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
