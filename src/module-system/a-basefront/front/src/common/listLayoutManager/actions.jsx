import Vue from 'vue';
export default {
  data() {
    return {};
  },
  methods: {
    async actions_fetchActions(item) {
      if (item._actions) return;
      // fetch
      const actions = await this.$api.post('/a/base/atom/actions', {
        key: { atomId: item.atomId },
        basic: !this.$device.desktop,
      });
      // workflow
      if (item.atomStage === 0 && item.atomFlowId > 0) {
        actions.push({
          module: item.module,
          atomClassName: item.atomClassName,
          name: 'workflow',
        });
      }
      // set
      Vue.set(item, '_actions', actions);
    },
  },
};
