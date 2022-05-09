export default {
  data() {
    return {};
  },
  methods: {
    actions_render() {
      if (!this.base.ready) return null;
      const children = [];
      // MarkAllAsRead
      children.push(
        <eb-link
          key="actionsMarkAllAsRead"
          iconF7="::mark-email-read"
          propsOnPerform={this.actions_onPerformMarkAllAsRead}
        ></eb-link>
      );
      //
      return children;
    },
    async actions_onPerformMarkAllAsRead() {
      await this.$api.post('/a/socketio/message/setRead', {
        messageClass: this.base_messageClass,
        all: true,
      });
      this.message_readAll();
    },
  },
};
