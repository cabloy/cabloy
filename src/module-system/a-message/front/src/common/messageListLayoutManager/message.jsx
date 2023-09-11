export default {
  data() {
    return {
      message: {
        queueScroll: null,
      },
    };
  },
  created() {
    // queueScroll
    this.message.queueScroll = this.$meta.util.queue(this.message_queueTaskScroll.bind(this));
  },
  beforeDestroy() {},
  methods: {
    message_readSet({ message }) {
      const items = this.data_getItems();
      const item = items.find(item => item.id === message.id);
      if (item) {
        item.messageRead = 1;
      }
    },
    message_readAll() {
      const items = this.data_getItems();
      for (const item of items) {
        if (item.messageRead === 0) {
          item.messageRead = 1;
        }
      }
    },
    message_appendNew({ message }) {
      const items = this.data_getItems();
      items.unshift(message);
      this.message_scroll();
    },
    message_scroll() {
      this.$nextTick(() => {
        this.message.queueScroll.push();
      });
    },
    message_queueTaskScroll(none, cb) {
      const pageContent = this.$$(this.$page2.$el).find('.page-content');
      if (pageContent.scrollTop() === 0) return cb();
      pageContent.scrollTop(0, 300, cb);
    },
  },
};
