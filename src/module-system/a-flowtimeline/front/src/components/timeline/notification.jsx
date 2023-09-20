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
      const useStoreUniform = await this.$meta.store.use('a/message/uniform');
      const simple = await useStoreUniform.getSimple();
      this.notification.simple = simple;
      this.notification.callbackId = this.notification.simple.register(
        'a-flow:workflow',
        this.notification_callback.bind(this)
      );
    },
    notification_dispose() {
      if (this.notification.callbackId) {
        this.notification.simple.unRegister(this.notification.callbackId);
        this.notification.callbackId = 0;
      }
    },
    async notification_callback({ scene, /* message,*/ content }) {
      if (scene === 'click') {
        const flowId = this.base_flow && this.base_flow.flowId;
        if (flowId === content.params.flowId) {
          this.base_emitActionReload({ flowId, atomChanged: true });
          return false; // break the next callbacks
        }
      }
    },
  },
};
