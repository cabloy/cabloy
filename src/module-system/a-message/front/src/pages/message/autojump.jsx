export default {
  data() {
    return {
      messageId: parseInt(this.$f7route.query.id),
    };
  },
  methods: {
    onPageAfterIn() {
      this.autojump();
    },
    async autojump() {
      // message
      const options = {
        where: {
          'a.id': this.messageId,
        },
      };
      const messages = await this.$api.post('/a/socketio/message/select', { options });
      const message = messages.list[0];
      if (!message) {
        this.$view.toast.show({ text: this.$text('Message Not Exists') });
        return;
      }
      // content
      const content = JSON.parse(message.content);
      // uniform messages
      const action = {
        actionModule: 'a-message',
        actionComponent: 'uniform',
        name: 'initialize',
      };
      const simple = await this.$meta.util.performAction({ ctx: this, action });
      // open
      simple._openMessage({
        message,
        content,
        options: {
          ctx: this,
          target: '_self',
          reloadCurrent: true,
        },
      });
    },
  },
  render() {
    return (
      <eb-page onPageAfterIn={this.onPageAfterIn}>
        <eb-navbar large largeTransparent title={this.$text('Message')} eb-back-link="Back"></eb-navbar>
        <f7-block>
        </f7-block>
      </eb-page>
    );
  },
};
