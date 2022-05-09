export default {
  data() {
    return {
      notification: {
        simple: null,
        callbackId: 0,
      },
    };
  },
  created() {
    // uniform messages
    const action = {
      actionModule: 'a-message',
      actionComponent: 'uniform',
      name: 'initialize',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(simple => {
      const messageClass = this.base_messageClass;
      const messageClassName = `${messageClass.module}:${messageClass.messageClassName}`;
      this.notification.simple = simple;
      this.notification.callbackId = this.notification.simple.register(
        messageClassName,
        this.notification_callback.bind(this)
      );
    });
  },
  beforeDestroy() {
    if (this.notification.callbackId) {
      this.notification.simple.unRegister(this.notification.callbackId);
      this.notification.callbackId = 0;
    }
  },
  methods: {
    async notification_callback({ scene, message, content }) {
      if (scene === 'show') {
        // just only append to list
        const messageNew = { ...message, messageRead: 0 };
        this.message_appendNew({ message: messageNew });
        // false
        return false;
      } else if (scene === 'click') {
        // just change messageRead=1
        this.message_readSet({ message });
        // false
        return false;
      }
    },
  },
};
