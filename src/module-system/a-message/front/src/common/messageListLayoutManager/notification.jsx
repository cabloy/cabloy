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
      const messageClass = this.container.messageClass;
      const messageClassName = `${messageClass.info.module}:${messageClass.info.name}`;
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
        if (this.layout.instance) {
          this.layout.instance.messageAppendNew({ message: messageNew });
        }
        // false
        return false;
      } else if (scene === 'click') {
        const flowId = this.base_flow && this.base_flow.flowId;
        if (flowId === content.params.flowId) {
          this.base_loadData();
          return true;
        }
      }
    },
  },
};
