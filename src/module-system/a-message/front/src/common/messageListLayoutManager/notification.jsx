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
    this.notification_init();
  },
  beforeDestroy() {
    this.notification_dispose();
  },
  methods: {
    async notification_init() {
      // uniform messages
      const useStoreUniform = await this.$store.use('a/message/uniform');
      const simple = await useStoreUniform.getSimple();
      //
      const messageClass = this.base_messageClass;
      const messageClassName = `${messageClass.module}:${messageClass.messageClassName}`;
      this.notification.simple = simple;
      this.notification.callbackId = this.notification.simple.register(
        messageClassName,
        this.notification_callback.bind(this)
      );
    },
    notification_dispose() {
      if (this.notification.callbackId) {
        this.notification.simple.unRegister(this.notification.callbackId);
        this.notification.callbackId = 0;
      }
    },
    async notification_callback({ scene, message /* , content*/ }) {
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
