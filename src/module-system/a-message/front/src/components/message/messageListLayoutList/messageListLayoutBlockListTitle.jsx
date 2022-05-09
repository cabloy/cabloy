export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    async onPerformMarkAllAsRead() {
      await this.$api.post('/a/socketio/message/setRead', {
        messageClass: this.layoutManager.base_messageClass,
        all: true,
      });
      this.layoutManager.message_readAll();
    },
  },
  render() {
    return (
      <f7-nav-right>
        <eb-link iconF7="::mark-email-read" propsOnPerform={this.onPerformMarkAllAsRead}></eb-link>
      </f7-nav-right>
    );
  },
};
