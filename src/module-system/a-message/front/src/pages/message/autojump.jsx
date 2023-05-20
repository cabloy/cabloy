export default {
  data() {
    return {
      messageId: parseInt(this.$f7route.query.id),
      done: false,
    };
  },
  methods: {
    onPageAfterIn() {
      // only once
      if (!this.done) {
        this.autojump()
          .then(() => {
            this.done = true;
          })
          .catch(err => {
            this.done = true;
            this.$view.toast.show({ text: err.message });
          });
      }
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
        throw new Error(this.$text('Message Not Exists'));
      }
      // content
      const content = JSON.parse(message.content);
      // uniform messages
      const useStoreUniform = await this.$store.use('a/message/uniform');
      const simple = await useStoreUniform.getSimple();
      // open
      await simple._openMessage({
        message,
        content,
        options: {
          navigate: {
            ctx: this,
            target: '_self',
            reloadCurrent: true,
          },
        },
      });
    },
  },
  render() {
    return (
      <eb-page onPageAfterIn={this.onPageAfterIn}>
        <eb-navbar title={this.$text('Message')} eb-back-link="Back"></eb-navbar>
        <f7-block class="text-align-center">{!this.done && <f7-preloader></f7-preloader>}</f7-block>
      </eb-page>
    );
  },
};
