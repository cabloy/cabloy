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
    this.init();
  },
  beforeDestroy() {
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {
    async init() {
      // queueScroll
      this._queueScroll = this.$meta.util.queue(this._queueTaskScroll.bind(this));
      // instance
      await this.layoutManager.layout_setInstance(this);
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
