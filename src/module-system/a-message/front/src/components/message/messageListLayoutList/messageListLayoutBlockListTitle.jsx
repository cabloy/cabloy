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
    return {
    };
  },
  created() {
  },
  methods: {
    async onPerformMarkAllAsRead() {
      await this.$api.post('/a/socketio/message/setRead', {
        messageClass: this.layoutManager.base_messageClass,
        all: true,
      });
      this.layoutManager.layout.instance.messageReadAll();
    },
  },
  render() {
    return (
      <f7-nav-right>
        <eb-link iconMaterial="mark_email_read" propsOnPerform={this.onPerformMarkAllAsRead}></eb-link>
      </f7-nav-right>
    );
  },
};
