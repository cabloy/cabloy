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
      this.notification.simple = simple;
      this.notification.callbackId = this.notification.simple.register(
        'a-flow:workflow',
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
      if (scene === 'click') {
        const flowId = this.base_flow && this.base_flow.flowId;
        if (flowId === content.params.flowId) {
          this.base_loadData();
          return true;
        }
      }
    },
  },
};
